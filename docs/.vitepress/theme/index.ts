import { h, nextTick } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'

// 增强组件
import Callout from './components/Callout.vue'
import HomeFeatures from './components/HomeFeatures.vue'

export default {
  extends: DefaultTheme,
  
  Layout: () => {
    return h(DefaultTheme.Layout, null, {})
  },

  enhanceApp({ app, router }) {
    // 注册全局组件
    app.component('Callout', Callout)
    app.component('HomeFeatures', HomeFeatures)

    // 客户端交互增强
    if (typeof window !== 'undefined') {
      
      // 1. 全局 Spotlight 效果 (Performance Optimized - Event Delegation)
      const handleSpotlightMove = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('.glass-card, .bento-item, .VPFeature, .link-card, .spotlight-target');
        
        if (target) {
          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          (target as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
          (target as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
        }
      };

      // 2. 页面切换动画 (Page Content Fade)
      const triggerPageFade = () => {
        // 关键修复：只选择正文容器，避开 Right Aside，防止 sticky 失效
        const content = document.querySelector('.VPDoc .content-container');
        if (content) {
          content.classList.remove('animate-fade-in');
          // 强制重绘
          void (content as HTMLElement).offsetWidth; 
          content.classList.add('animate-fade-in');
        }
      };
      
      // 3. 全局物理点击反馈
      const handleGlobalClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a, button, .VPFeature, .action-button, .glass-card');
        if (target) {
          (target as HTMLElement).style.transform = 'scale(0.98)';
          setTimeout(() => {
            (target as HTMLElement).style.transform = '';
          }, 150);
        }
      };

      // 路由变化时
      router.onAfterRouteChanged = () => {
        nextTick(() => {
          triggerPageFade();
        });
      }

      // 初始化挂载
      window.addEventListener('mousemove', handleSpotlightMove, { passive: true });
      window.addEventListener('mousedown', handleGlobalClick, { passive: true });
      
      // 首次加载
      window.addEventListener('load', () => {
         triggerPageFade();
      });
    }
  }
} satisfies Theme
