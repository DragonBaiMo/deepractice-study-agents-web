/**
 * 链接检查脚本
 * 检查文档中的内部链接和外部链接有效性
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import chalk from 'chalk'

const DOCS_DIR = path.resolve('docs')
const CHECK_EXTERNAL = process.argv.includes('--external')

// 统计
const stats = {
  internal: { total: 0, valid: 0, broken: 0 },
  external: { total: 0, valid: 0, broken: 0, skipped: 0 }
}

const brokenLinks = []

/**
 * 提取文档中的链接
 */
function extractLinks(content, filePath) {
  const sanitizedContent = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
  const links = []
  const skipUrls = new Set(['链接'])
  
  // Markdown 链接 [text](url)
  const mdLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g
  let match
  
  while ((match = mdLinkRegex.exec(sanitizedContent)) !== null) {
    const url = match[2].split('#')[0].trim()
    if (!url || skipUrls.has(url)) {
      continue
    }
    if (url) {
      links.push({
        text: match[1],
        url: url,
        isExternal: url.startsWith('http://') || url.startsWith('https://'),
        source: filePath
      })
    }
  }
  
  return links
}

/**
 * 检查内部链接
 */
function checkInternalLink(link) {
  stats.internal.total++
  
  const sourceDir = path.dirname(link.source)
  let targetPath = link.url
  
  // 处理相对路径
  if (targetPath.startsWith('/')) {
    targetPath = path.join(DOCS_DIR, targetPath)
  } else {
    targetPath = path.resolve(sourceDir, targetPath)
  }
  
  // 检查各种可能的文件
  const possiblePaths = [
    targetPath,
    targetPath + '.md',
    path.join(targetPath, 'index.md'),
    path.join(targetPath, 'README.md')
  ]
  
  const exists = possiblePaths.some(p => fs.existsSync(p))
  
  if (exists) {
    stats.internal.valid++
    return true
  } else {
    stats.internal.broken++
    brokenLinks.push({
      type: 'internal',
      source: path.relative(DOCS_DIR, link.source),
      url: link.url,
      text: link.text
    })
    return false
  }
}

/**
 * 检查外部链接（可选）
 */
async function checkExternalLink(link) {
  stats.external.total++
  
  if (!CHECK_EXTERNAL) {
    stats.external.skipped++
    return true
  }
  
  try {
    const response = await fetch(link.url, {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)'
      }
    })
    
    if (response.ok) {
      stats.external.valid++
      return true
    } else {
      stats.external.broken++
      brokenLinks.push({
        type: 'external',
        source: path.relative(DOCS_DIR, link.source),
        url: link.url,
        text: link.text,
        status: response.status
      })
      return false
    }
  } catch (error) {
    stats.external.broken++
    brokenLinks.push({
      type: 'external',
      source: path.relative(DOCS_DIR, link.source),
      url: link.url,
      text: link.text,
      error: error.message
    })
    return false
  }
}

/**
 * 主函数
 */
async function main() {
  console.log(chalk.blue('🔗 检查链接有效性...\n'))
  
  if (!CHECK_EXTERNAL) {
    console.log(chalk.gray('  提示: 使用 --external 参数检查外部链接\n'))
  }

  // 查找所有 Markdown 文件
  const files = await glob('**/*.md', { 
    cwd: DOCS_DIR,
    ignore: ['node_modules/**', '.vitepress/**']
  })

  // 收集所有链接
  const allLinks = []
  
  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const links = extractLinks(content, filePath)
    allLinks.push(...links)
  }

  console.log(chalk.gray(`  发现 ${allLinks.length} 个链接\n`))

  // 检查链接
  for (const link of allLinks) {
    if (link.isExternal) {
      await checkExternalLink(link)
    } else {
      checkInternalLink(link)
    }
  }

  // 输出结果
  console.log(chalk.blue('\n📊 检查结果:\n'))
  
  console.log(chalk.cyan('  内部链接:'))
  console.log(`    总数: ${stats.internal.total}`)
  console.log(chalk.green(`    有效: ${stats.internal.valid}`))
  console.log(chalk.red(`    失效: ${stats.internal.broken}`))
  
  console.log(chalk.cyan('\n  外部链接:'))
  console.log(`    总数: ${stats.external.total}`)
  if (CHECK_EXTERNAL) {
    console.log(chalk.green(`    有效: ${stats.external.valid}`))
    console.log(chalk.red(`    失效: ${stats.external.broken}`))
  } else {
    console.log(chalk.gray(`    跳过: ${stats.external.skipped}`))
  }

  // 输出失效链接详情
  if (brokenLinks.length > 0) {
    console.log(chalk.red('\n❌ 失效链接详情:\n'))
    
    for (const link of brokenLinks) {
      console.log(chalk.yellow(`  ${link.source}`))
      console.log(chalk.red(`    → ${link.url}`))
      if (link.status) {
        console.log(chalk.gray(`      HTTP ${link.status}`))
      }
      if (link.error) {
        console.log(chalk.gray(`      ${link.error}`))
      }
      console.log()
    }
  }

  // 有失效内部链接时退出
  if (stats.internal.broken > 0) {
    console.log(chalk.red('❌ 存在失效的内部链接，请修复后重试'))
    process.exit(1)
  }

  console.log(chalk.green('✅ 链接检查通过'))
}

main().catch(console.error)
