/**
 * 导航生成脚本
 * 根据目录结构和 Frontmatter 自动生成侧边栏配置
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import chalk from 'chalk'

const DOCS_DIR = path.resolve('docs')
const OUTPUT_FILE = path.resolve('docs/.vitepress/theme/generated-sidebar.json')

/**
 * 解析文档元数据
 */
function parseDocMeta(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    return {
      title: data.title || extractTitleFromContent(content),
      order: data.order ?? 999,
      slug: data.slug,
      tags: data.tags || [],
      status: data.status || 'stable'
    }
  } catch (error) {
    return {
      title: path.basename(filePath, '.md'),
      order: 999,
      tags: [],
      status: 'stable'
    }
  }
}

/**
 * 从内容中提取标题
 */
function extractTitleFromContent(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : '未命名'
}

/**
 * 生成章节导航
 */
async function generateChapterNav(chapterDir) {
  const chapterName = path.basename(chapterDir)
  const files = await glob('*.md', { cwd: chapterDir })
  
  const items = []
  
  for (const file of files) {
    const filePath = path.join(chapterDir, file)
    const meta = parseDocMeta(filePath)
    
    // 跳过草稿
    if (meta.status === 'draft') continue
    
    // README/index 作为章节首页
    const isIndex = file.toLowerCase() === 'readme.md' || file.toLowerCase() === 'index.md'
    
    items.push({
      text: meta.title,
      link: `/docs/${chapterName}/${isIndex ? '' : file.replace('.md', '')}`,
      order: isIndex ? -1 : meta.order
    })
  }
  
  // 按 order 排序
  items.sort((a, b) => a.order - b.order)
  
  return items.map(({ text, link }) => ({ text, link }))
}

/**
 * 主函数
 */
async function main() {
  console.log(chalk.blue('📁 生成导航配置...\n'))

  const sidebar = {}
  
  // 查找所有章节目录
  const chapters = await glob('chapter*/', { cwd: DOCS_DIR })
  
  for (const chapter of chapters) {
    const chapterDir = path.join(DOCS_DIR, chapter)
    const items = await generateChapterNav(chapterDir)
    
    if (items.length > 0) {
      sidebar[chapter.replace('/', '')] = items
    }
    
    console.log(chalk.gray(`  ${chapter}: ${items.length} 个文档`))
  }

  // 写入配置文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sidebar, null, 2))
  
  console.log(chalk.green(`\n✅ 导航配置已生成: ${path.relative(process.cwd(), OUTPUT_FILE)}`))
}

main().catch(console.error)
