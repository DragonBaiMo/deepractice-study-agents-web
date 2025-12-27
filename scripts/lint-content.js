/**
 * 内容规范检查脚本
 * 检查 Markdown 文档是否符合规范：
 * 1. Frontmatter 必填字段
 * 2. 标题层级规范
 * 3. 图片存在性
 * 4. 内部链接有效性
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import chalk from 'chalk'

const DOCS_DIR = path.resolve('docs')
const REQUIRED_FIELDS = ['title']
const RECOMMENDED_FIELDS = ['order', 'tags']

// 统计
const stats = {
  total: 0,
  passed: 0,
  warnings: 0,
  errors: 0
}

// 错误和警告收集
const issues = []

/**
 * 检查单个文件
 */
async function checkFile(filePath) {
  stats.total++
  const relativePath = path.relative(DOCS_DIR, filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  const fileIssues = []

  try {
    const { data: frontmatter, content: body } = matter(content)

    // 1. 检查必填字段
    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        fileIssues.push({
          type: 'error',
          message: `缺少必填字段: ${field}`
        })
      }
    }

    // 2. 检查推荐字段
    for (const field of RECOMMENDED_FIELDS) {
      if (!frontmatter[field]) {
        fileIssues.push({
          type: 'warning',
          message: `建议添加字段: ${field}`
        })
      }
    }

    // 3. 检查标题层级
    const headings = body.match(/^#{1,6}\s+.+$/gm) || []
    let prevLevel = 0
    for (const heading of headings) {
      const level = heading.match(/^#+/)[0].length
      if (prevLevel > 0 && level > prevLevel + 1) {
        fileIssues.push({
          type: 'warning',
          message: `标题层级跳跃: ${heading.trim()}`
        })
      }
      prevLevel = level
    }

    // 4. 检查图片引用
    const imageRefs = body.match(/!\[.*?\]\((.*?)\)/g) || []
    for (const ref of imageRefs) {
      const imgPath = ref.match(/\((.*?)\)/)?.[1]
      if (imgPath && !imgPath.startsWith('http')) {
        const absolutePath = path.resolve(path.dirname(filePath), imgPath)
        if (!fs.existsSync(absolutePath)) {
          fileIssues.push({
            type: 'error',
            message: `图片不存在: ${imgPath}`
          })
        }
      }
    }

    // 5. 检查内部链接
    const linkRefs = body.match(/\[.*?\]\(((?!http)[^)]+)\)/g) || []
    for (const ref of linkRefs) {
      const linkPath = ref.match(/\((.*?)\)/)?.[1]
      if (linkPath && !linkPath.startsWith('#')) {
        const cleanPath = linkPath.split('#')[0]
        const absolutePath = path.resolve(path.dirname(filePath), cleanPath)
        
        // 检查 .md 文件或目录
        const mdPath = absolutePath.endsWith('.md') ? absolutePath : `${absolutePath}.md`
        const indexPath = path.join(absolutePath, 'index.md')
        const readmePath = path.join(absolutePath, 'README.md')
        
        if (!fs.existsSync(mdPath) && 
            !fs.existsSync(indexPath) && 
            !fs.existsSync(readmePath) &&
            !fs.existsSync(absolutePath)) {
          fileIssues.push({
            type: 'warning',
            message: `链接目标可能不存在: ${linkPath}`
          })
        }
      }
    }

  } catch (error) {
    fileIssues.push({
      type: 'error',
      message: `解析失败: ${error.message}`
    })
  }

  // 统计结果
  const errors = fileIssues.filter(i => i.type === 'error')
  const warnings = fileIssues.filter(i => i.type === 'warning')

  if (errors.length > 0) {
    stats.errors += errors.length
  }
  if (warnings.length > 0) {
    stats.warnings += warnings.length
  }
  if (errors.length === 0) {
    stats.passed++
  }

  if (fileIssues.length > 0) {
    issues.push({ file: relativePath, issues: fileIssues })
  }
}

/**
 * 主函数
 */
async function main() {
  console.log(chalk.blue('📝 检查内容规范...\n'))

  // 查找所有 Markdown 文件
  const files = await glob('**/*.md', { 
    cwd: DOCS_DIR,
    ignore: ['node_modules/**', '.vitepress/**']
  })

  // 检查每个文件
  for (const file of files) {
    await checkFile(path.join(DOCS_DIR, file))
  }

  // 输出结果
  console.log(chalk.blue('\n📊 检查结果:\n'))
  
  for (const { file, issues: fileIssues } of issues) {
    console.log(chalk.cyan(`  ${file}`))
    for (const issue of fileIssues) {
      const icon = issue.type === 'error' ? '❌' : '⚠️'
      const color = issue.type === 'error' ? chalk.red : chalk.yellow
      console.log(color(`    ${icon} ${issue.message}`))
    }
    console.log()
  }

  console.log(chalk.blue('📈 统计:'))
  console.log(`  总文件数: ${stats.total}`)
  console.log(chalk.green(`  通过: ${stats.passed}`))
  console.log(chalk.yellow(`  警告: ${stats.warnings}`))
  console.log(chalk.red(`  错误: ${stats.errors}`))

  // 有错误时退出
  if (stats.errors > 0) {
    console.log(chalk.red('\n❌ 存在错误，请修复后重试'))
    process.exit(1)
  }

  console.log(chalk.green('\n✅ 内容规范检查通过'))
}

main().catch(console.error)
