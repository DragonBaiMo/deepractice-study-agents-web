/**
 * 预构建脚本
 * 在 VitePress 构建前执行：
 * 1. 验证内容规范
 * 2. 生成导航配置
 * 3. 生成搜索索引
 */

import { execSync } from 'child_process'
import chalk from 'chalk'

console.log(chalk.blue('🚀 开始预构建流程...\n'))

const steps = [
  { name: '同步内容', script: 'node scripts/sync-content.js' },
  { name: '修复 HTML 属性', script: 'node scripts/fix-html-attributes.js' },
  { name: '内容规范检查', script: 'node scripts/lint-content.js' },
  { name: '生成导航配置', script: 'node scripts/generate-nav.js' },
  { name: '生成搜索索引', script: 'node scripts/generate-search-index.js' }
]

let hasError = false

for (const step of steps) {
  console.log(chalk.yellow(`📋 ${step.name}...`))
  
  try {
    execSync(step.script, { stdio: 'inherit' })
    console.log(chalk.green(`✅ ${step.name} 完成\n`))
  } catch (error) {
    console.error(chalk.red(`❌ ${step.name} 失败\n`))
    hasError = true
    // 继续执行其他步骤，但最终会失败
  }
}

if (hasError) {
  console.error(chalk.red('\n❌ 预构建失败，请修复上述问题后重试'))
  process.exit(1)
}

console.log(chalk.green('✅ 预构建完成，开始构建站点...\n'))
