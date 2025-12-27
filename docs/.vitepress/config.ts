import { defineConfig } from 'vitepress'
import { generateSidebar } from './theme/sidebar'

export default defineConfig({
  title: 'Deepractice AI',
  description: '构建下一代智能体系统的深度实践指南',
  lang: 'zh-CN',
  base: '/deepractice-study-agents-web/',
  
  head: [
    ['link', { rel: 'icon', href: '/logo.png', type: 'image/png' }],
    ['meta', { name: 'theme-color', content: '#3B82F6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Deepractice AI - 智能体开发实战' }],
    ['meta', { property: 'og:description', content: '基于 TypeScript + AgentX + PromptX 的全栈智能体架构实战' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }]
  ],

  // 内容安全策略
  contentProps: {
    class: 'content-body'
  },

  themeConfig: {
    logo: '/logo.png',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '学习地图', link: '/learning-map/' },
      { text: '知识库', link: '/docs/' },
      { text: '资源库', link: '/resources/' },
      {
        text: '关于',
        items: [
          { text: '关于项目', link: '/about/' },
          { text: '贡献指南', link: '/contributing' },
          { text: '更新日志', link: '/changelog' }
        ]
      }
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yejunhao159/deepractice-agents' }
    ],

    footer: {
      copyright: '© 2025 Deepractice AI Limited. All rights reserved.'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    editLink: {
      pattern: 'https://github.com/yejunhao159/deepractice-agents/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'vitesse-light',
      dark: 'one-dark-pro'
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    build: {
      chunkSizeWarningLimit: 1000
    }
  },

  sitemap: {
    hostname: 'https://docs.deepractice.cn'
  },

  // 忽略死链接检查（原始内容中的链接可能指向不存在的页面）
  ignoreDeadLinks: [
    // 忽略相对路径的 README 链接
    /\.\.\/README/,
    // 忽略章节索引链接
    /\/docs\/chapter\d+\/index/,
    /\/docs\/chapter\d+\//
  ],

  lastUpdated: true,
  cleanUrls: true
})
