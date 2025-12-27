/**
 * 内容同步脚本
 * 将原始教材内容同步到文档站点，并添加 Frontmatter
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import chalk from 'chalk'

const SOURCE_DIR_CANDIDATES = [
  process.env.DEEPRACTICE_SOURCE_DIR,
  path.resolve('deepractice-agents-main/docs'),
  path.resolve('../deepractice-agents-main/docs')
].filter(Boolean)
const TARGET_DIR = path.resolve('docs/docs')

// 章节标题映射
const chapterTitles = {
  'chapter01': '初识智能体',
  'chapter02': '智能体发展史',
  'chapter03': '大语言模型基础',
  'chapter04': '智能体经典范式',
  'chapter05': 'PromptX 认知系统',
  'chapter06': 'Deepractice 框架体系',
  'chapter07': 'AgentX 事件驱动框架',
  'chapter08': '多智能体框架实践',
  'chapter09': 'Monogent 认知架构',
  'chapter10': '上下文工程',
  'chapter11': '智能体通信协议',
  'chapter12': 'Agentic-RL',
  'chapter13': '智能体性能评估',
  'chapter14': '智能旅行助手',
  'chapter15': '自动化深度研究',
  'chapter16': '构建赛博小镇'
}

function resolveSourceDir() {
  for (const candidate of SOURCE_DIR_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }
  return null
}

const SOURCE_DIR = resolveSourceDir()

/**
 * 修复 HTML 属性中的嵌套引号问题
 * 例如: alt="文字"内部引号"更多" -> alt="文字&quot;内部引号&quot;更多"
 */
function fixHtmlAttributeQuotes(content) {
  // 处理 img 标签的属性（最常见的问题来源）
  return content.replace(/<img\s+([^>]*)\/?>/gi, (match, attrs) => {
    let result = '<img '
    let i = 0
    
    while (i < attrs.length) {
      // 查找属性模式: name="value"
      const attrMatch = attrs.slice(i).match(/^(\w+)="/)
      if (attrMatch) {
        const attrName = attrMatch[1]
        i += attrMatch[0].length
        
        // 找到属性值的结束位置
        // 值结束于下一个后跟空格、/ 或结尾的引号
        let valueStart = i
        let valueEnd = -1
        
        for (let j = i; j < attrs.length; j++) {
          if (attrs[j] === '"') {
            const nextChar = attrs[j + 1]
            if (nextChar === undefined || nextChar === ' ' || nextChar === '/' || nextChar === '>') {
              valueEnd = j
              break
            }
          }
        }
        
        if (valueEnd === -1) {
          valueEnd = attrs.length
        }
        
        const value = attrs.slice(valueStart, valueEnd)
        // 转义属性值内部的引号
        const escapedValue = value.replace(/"/g, '&quot;')
        result += `${attrName}="${escapedValue}" `
        
        i = valueEnd + 1
      } else if (attrs[i] === ' ' || attrs[i] === '/') {
        i++
      } else {
        result += attrs[i]
        i++
      }
    }
    
    return result.trim() + '/>'
  })
}

/**
 * 修复未闭合的 HTML 标签
 * 检查常见的块级标签是否正确闭合
 */
function fixUnclosedHtmlTags(content) {
  // 检查 div 标签
  const divOpenCount = (content.match(/<div[^>]*>/gi) || []).length
  const divCloseCount = (content.match(/<\/div>/gi) || []).length
  
  if (divOpenCount > divCloseCount) {
    // 添加缺失的闭合标签
    const missing = divOpenCount - divCloseCount
    for (let i = 0; i < missing; i++) {
      content += '\n</div>'
    }
  }
  
  return content
}

/**
 * 从文件名提取排序号
 */
function extractOrder(filename) {
  const match = filename.match(/^(\d+)\.(\d+)/)
  if (match) {
    return parseInt(match[1]) * 100 + parseInt(match[2])
  }
  if (filename.toLowerCase() === 'readme.md') {
    return 0
  }
  return 999
}

/**
 * 从内容提取标题
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

/**
 * 处理单个文件
 * @param {string} sourcePath - 源文件路径
 * @param {string} targetPath - 目标文件路径（README.md 会自动转为 index.md）
 */
function processFile(sourcePath, targetPath) {
  let content = fs.readFileSync(sourcePath, 'utf-8')
  const filename = path.basename(sourcePath)
  
  // VitePress 使用 index.md 作为目录入口，将 README.md 重命名
  if (filename.toLowerCase() === 'readme.md') {
    targetPath = path.join(path.dirname(targetPath), 'index.md')
  }
  
  // 检查是否已有 Frontmatter
  let { data: existingFrontmatter, content: body } = matter(content)
  
  // 提取或生成元数据
  const title = existingFrontmatter.title || extractTitle(body) || filename.replace('.md', '')
  const order = existingFrontmatter.order ?? extractOrder(filename)
  
  // 构建新的 Frontmatter
  const frontmatter = {
    title,
    order,
    ...existingFrontmatter
  }
  
  // 生成新内容
  let newContent = matter.stringify(body, frontmatter)
  
  // 处理 HTML 标签中的引号问题（VitePress/Vue 编译兼容）
  // 问题：HTML 属性如 alt="文字"内部引号"更多文字" 会导致解析错误
  // 解决：将 HTML 属性内部的引号替换为 HTML 实体 &quot;
  newContent = fixHtmlAttributeQuotes(newContent)
  
  // 修复未闭合的 HTML 标签
  newContent = fixUnclosedHtmlTags(newContent)
  
  // 同时处理中文引号（如果有的话）
  newContent = newContent.replace(/\u201c/g, '"').replace(/\u201d/g, '"')
  newContent = newContent.replace(/\u2018/g, "'").replace(/\u2019/g, "'")
  
  // 修复内部链接：将 README.md 链接转换为目录链接（VitePress 使用 index.md）
  newContent = newContent.replace(/README\.md/gi, '')
  
  // 确保目标目录存在
  const targetDir = path.dirname(targetPath)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }
  
  // 写入文件
  fs.writeFileSync(targetPath, newContent)
  
  return { title, order }
}

/**
 * 同步图片
 */
function syncImages() {
  const sourceImagesDir = path.join(SOURCE_DIR, 'images')
  const targetImagesDir = path.join(TARGET_DIR, '../images')
  
  if (!fs.existsSync(sourceImagesDir)) {
    console.log(chalk.yellow('  源图片目录不存在，跳过图片同步'))
    return
  }
  
  // 复制整个图片目录
  if (!fs.existsSync(targetImagesDir)) {
    fs.mkdirSync(targetImagesDir, { recursive: true })
  }
  
  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
      }
      fs.readdirSync(src).forEach(child => {
        copyRecursive(path.join(src, child), path.join(dest, child))
      })
    } else {
      fs.copyFileSync(src, dest)
    }
  }
  
  copyRecursive(sourceImagesDir, targetImagesDir)
  console.log(chalk.green('  ✅ 图片同步完成'))
}

/**
 * 主函数
 */
async function main() {
  console.log(chalk.blue('📥 开始同步内容...\n'))
  
  // 检查源目录
  if (!SOURCE_DIR) {
    console.error(chalk.red(`? 源目录不存在: ${SOURCE_DIR_CANDIDATES.join(", ")}`))
    process.exit(1)
  }
  
  // 同步章节内容
  const chapters = await glob('chapter*/', { cwd: SOURCE_DIR })
  
  for (const chapter of chapters) {
    const chapterName = chapter.replace('/', '')
    console.log(chalk.cyan(`  ${chapterName}: ${chapterTitles[chapterName] || '未知章节'}`))
    
    const files = await glob('*.md', { cwd: path.join(SOURCE_DIR, chapter) })
    
    for (const file of files) {
      const sourcePath = path.join(SOURCE_DIR, chapter, file)
      const targetPath = path.join(TARGET_DIR, chapter, file)
      
      const { title } = processFile(sourcePath, targetPath)
      console.log(chalk.gray(`    - ${file}: ${title}`))
    }
  }
  
  // 同步前言
  const prefacePath = path.join(SOURCE_DIR, '前言.md')
  if (fs.existsSync(prefacePath)) {
    processFile(prefacePath, path.join(TARGET_DIR, 'preface.md'))
    console.log(chalk.gray('  - 前言.md'))
  }
  
  // 同步图片
  console.log(chalk.cyan('\n  同步图片...'))
  syncImages()
  
  console.log(chalk.green('\n✅ 内容同步完成'))
}

main().catch(console.error)
