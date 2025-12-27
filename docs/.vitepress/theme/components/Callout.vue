<script setup lang="ts">
/**
 * Callout 提示块组件
 * 用于显示 info/warning/danger/tip 类型的提示信息
 */
defineProps<{
  type?: 'info' | 'warning' | 'danger' | 'tip'
  title?: string
}>()

const defaultTitles = {
  info: '信息',
  warning: '警告',
  danger: '危险',
  tip: '提示'
}
</script>

<template>
  <div :class="['callout', `callout-${type || 'info'}`]">
    <div class="callout-title">
      <span class="callout-icon">
        <svg v-if="type === 'info' || !type" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <svg v-if="type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <svg v-if="type === 'danger'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <svg v-if="type === 'tip'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.9.27-1.48.27-2.51a5.33 5.33 0 0 0-1.5-3.75m-3.86 0A5.33 5.33 0 0 0 8.36 12a4.92 4.92 0 0 0 .19 1.48"/></svg>
      </span>
      <span>{{ title || defaultTitles[type || 'info'] }}</span>
    </div>
    <div class="callout-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.callout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand-1);
}

.callout-warning .callout-icon { color: #EAB308; }
.callout-danger .callout-icon { color: #EF4444; }
.callout-tip .callout-icon { color: #10B981; }

.callout-content {
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.callout-content :deep(p) {
  margin: 0;
}

.callout-content :deep(p + p) {
  margin-top: 8px;
}

.callout-content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
}

.dark .callout-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
