<script setup lang="ts">
/**
 * Steps 步骤块组件
 * 用于分步展示操作流程
 */
import { computed, useSlots } from 'vue'

const slots = useSlots()

// 从默认插槽中提取步骤
const steps = computed(() => {
  const defaultSlot = slots.default?.()
  if (!defaultSlot) return []
  
  return defaultSlot.filter(vnode => 
    vnode.type && typeof vnode.type === 'object'
  )
})
</script>

<template>
  <div class="steps-container">
    <slot />
  </div>
</template>

<style scoped>
.steps-container {
  margin: 24px 0;
}
</style>
