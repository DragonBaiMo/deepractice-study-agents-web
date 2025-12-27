/**
 * 修复 Markdown 中 HTML 标签属性的引号问题
 * 仅处理 <img> 标签，避免影响代码块示例
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import chalk from 'chalk'

const DOCS_DIR = path.resolve('docs')

function fixHtmlAttributeQuotes(content) {
  return content.replace(/<img\s+([^>]*)\/?>/gi, (match, attrs) => {
    let result = '<img '
    let i = 0
    
    while (i < attrs.length) {
      const attrMatch = attrs.slice(i).match(/^(\w+)="/)
      if (attrMatch) {
        const attrName = attrMatch[1]
        i += attrMatch[0].length
        
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

function fixUnclosedDivTags(content) {
  const divOpenCount = (content.match(/<div[^>]*>/gi) || []).length
  const divCloseCount = (content.match(/<\/div>/gi) || []).length
  
  if (divOpenCount > divCloseCount) {
    const missing = divOpenCount - divCloseCount
    for (let i = 0; i < missing; i++) {
      content += '\n</div>'
    }
  }
  
  return content
}

async function main() {
  console.log(chalk.blue('修复 HTML 属性...\n'))
  
  if (!fs.existsSync(DOCS_DIR)) {
    console.log(chalk.red(`文档目录不存在: ${DOCS_DIR}`))
    process.exit(1)
  }

  const files = await glob('**/*.md', {
    cwd: DOCS_DIR,
    ignore: ['node_modules/**', '.vitepress/**']
  })

  let changedCount = 0

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    let fixed = fixHtmlAttributeQuotes(content)
    fixed = fixUnclosedDivTags(fixed)
    
    if (fixed !== content) {
      fs.writeFileSync(filePath, fixed)
      changedCount++
    }
  }

  console.log(chalk.green(`HTML 属性修复完成，处理文件数: ${changedCount}`))
}

main().catch((error) => {
  console.error(chalk.red(`修复失败: ${error.message}`))
  process.exit(1)
})
