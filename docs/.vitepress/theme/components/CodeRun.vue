<script setup lang="ts">
/**
 * CodeRun 代码演示块组件
 * 支持前端代码的在线运行演示
 */
import { ref, computed } from 'vue'

const props = defineProps<{
  language?: string
  title?: string
  runnable?: boolean
  sandboxUrl?: string
}>()

const output = ref<string>('')
const isRunning = ref(false)
const hasRun = ref(false)

// 是否可运行
const canRun = computed(() => {
  return props.runnable !== false && 
    ['javascript', 'js', 'typescript', 'ts'].includes(props.language || '')
})

// 运行代码
async function runCode() {
  if (isRunning.value) return
  
  isRunning.value = true
  output.value = ''
  
  try {
    // 获取代码内容
    const codeElement = document.querySelector('.code-run-code code')
    const code = codeElement?.textContent || ''
    
    // 创建安全的执行环境
    const logs: string[] = []
    const mockConsole = {
      log: (...args: any[]) => logs.push(args.map(String).join(' ')),
      error: (...args: any[]) => logs.push(`[Error] ${args.map(String).join(' ')}`),
      warn: (...args: any[]) => logs.push(`[Warn] ${args.map(String).join(' ')}`)
    }
    
    // 执行代码
    const fn = new Function('console', code)
    fn(mockConsole)
    
    output.value = logs.join('\n') || '(无输出)'
    hasRun.value = true
  } catch (error: any) {
    output.value = `执行错误: ${error.message}`
  } finally {
    isRunning.value = false
  }
}

// 打开沙盒
function openSandbox() {
  if (props.sandboxUrl) {
    window.open(props.sandboxUrl, '_blank')
  }
}
</script>

<template>
  <div class="code-run-container">
    <div class="code-run-header">
      <span class="code-run-title">{{ title || '代码示例' }}</span>
      <div class="code-run-actions">
        <button 
          v-if="sandboxUrl" 
          class="code-run-btn code-run-sandbox"
          @click="openSandbox"
        >
          在沙盒中打开
        </button>
        <button 
          v-if="canRun"
          class="code-run-btn"
          :disabled="isRunning"
          @click="runCode"
        >
          {{ isRunning ? '运行中...' : '运行' }}
        </button>
      </div>
    </div>
    
    <div class="code-run-code">
      <slot />
    </div>
    
    <div v-if="hasRun" class="code-run-output">
      <div class="code-run-output-header">输出结果</div>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<style scoped>
.code-run-actions {
  display: flex;
  gap: 8px;
}

.code-run-sandbox {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.code-run-sandbox:hover {
  border-color: var(--vp-c-brand-1);
}

.code-run-code {
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-run-code :deep(div[class*="language-"]) {
  margin: 0;
  border-radius: 0;
}

.code-run-output-header {
  padding: 8px 16px;
  background: #252525;
  font-size: 12px;
  color: #888;
  border-bottom: 1px solid #333;
}

.code-run-output pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
