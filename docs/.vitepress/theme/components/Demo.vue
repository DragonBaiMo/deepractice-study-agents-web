<script setup lang="ts">
/**
 * Demo 演示块组件
 * 用于展示操作演示、视频、动图等
 */
import { ref } from 'vue'

defineProps<{
  title?: string
  description?: string
  videoUrl?: string
  imageUrl?: string
}>()

const isExpanded = ref(false)
</script>

<template>
  <div class="demo-container">
    <div class="demo-header">
      <span class="demo-title">{{ title || '演示' }}</span>
      <button 
        v-if="$slots.details" 
        class="demo-toggle"
        @click="isExpanded = !isExpanded"
      >
        {{ isExpanded ? '收起详情' : '展开详情' }}
      </button>
    </div>
    
    <div class="demo-content">
      <p v-if="description" class="demo-description">{{ description }}</p>
      
      <!-- 视频演示 -->
      <div v-if="videoUrl" class="demo-video">
        <video :src="videoUrl" controls playsinline>
          您的浏览器不支持视频播放
        </video>
      </div>
      
      <!-- 图片/动图演示 -->
      <div v-if="imageUrl" class="demo-image">
        <img :src="imageUrl" :alt="title || '演示图片'" loading="lazy" />
      </div>
      
      <!-- 默认插槽内容 -->
      <div class="demo-preview">
        <slot />
      </div>
      
      <!-- 详情内容（可折叠） -->
      <div v-if="$slots.details && isExpanded" class="demo-details">
        <slot name="details" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-title {
  font-weight: 600;
}

.demo-toggle {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.demo-toggle:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.demo-description {
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
  font-size: 14px;
}

.demo-video video,
.demo-image img {
  max-width: 100%;
  border-radius: 4px;
}

.demo-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}
</style>
