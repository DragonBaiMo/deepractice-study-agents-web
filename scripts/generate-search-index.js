/**
 * 搜索索引生成脚本
 * 生成本地搜索索引，支持全文检索
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import chalk from 'chalk'

const DOCS_DIR = path.resolve('docs')
const OUTPUT_FILE = path.resolve('docs/public/search-index.json')

/**
 * 提取文档摘要
 */
function extractSummary(content, maxLength = 200) {
  // 移除 Markdown 语法
  const text = content
    .replace(/^#+\s+.+$/gm, '') // 标题
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // 代码
    .replace(/[*_~]+/g, '') // 强调
    .replace(/\n+/g, ' ') // 换行
    .trim()

  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...'
    : text
}

/**
 * 提取标题列表
 */
function extractHeadings(content) {
  const headings = []
  const regex = /^(#{2,3})\s+(.+)$/gm
  let match

  while ((match = regex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      anchor: match[2].trim().toLowerCase().replace(/\s+/g, '-')
    })
  }

  return headings
}

/**
 * 处理单个文档
 */
function processDocument(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const { data: frontmatter, content: body } = matter(content)
  
  const relativePath = path.relative(DOCS_DIR, filePath)
  const urlPath = '/' + relativePath
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')
    .replace(/\/README$/i, '/')
    .replace(/\/index$/i, '/')

  return {
    id: relativePath,
    title: frontmatter.title || extractTitleFromContent(body),
    path: urlPath,
    summary: extractSummary(body),
    headings: extractHeadings(body),
    tags: frontmatter.tags || [],
    content: body.substring(0, 5000) // 限制索引大小
  }
}

/**
 * 从内容提取标题
 */
function extractTitleFromContent(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : '未命名'
}

/**
 * 主函数
 */
async function main() {
  console.log(chalk.blue('🔍 生成搜索索引...\n'))

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 查找所有 Markdown 文件
  const files = await glob('**/*.md', { 
    cwd: DOCS_DIR,
    ignore: ['node_modules/**', '.vitepress/**']
  })

  const documents = []

  for (const file of files) {
    try {
      const doc = processDocument(path.join(DOCS_DIR, file))
      documents.push(doc)
      console.log(chalk.gray(`  索引: ${file}`))
    } catch (error) {
      console.log(chalk.yellow(`  跳过: ${file} (${error.message})`))
    }
  }

  // 生成索引
  const index = {
    version: '1.0',
    generated: new Date().toISOString(),
    documents: documents.map(({ id, title, path, summary, headings, tags }) => ({
      id,
      title,
      path,
      summary,
      headings,
      tags
    }))
  }

  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2))

  const sizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)
  console.log(chalk.green(`\n✅ 搜索索引已生成: ${documents.length} 个文档, ${sizeKB} KB`))
}

main().catch(console.error)
