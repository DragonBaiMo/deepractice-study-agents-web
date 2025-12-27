import type { DefaultTheme } from 'vitepress'

/**
 * 章节配置
 */
interface ChapterConfig {
  order: number
  title: string
  collapsed?: boolean
}

const chapterConfigs: Record<string, ChapterConfig> = {
  'chapter01': { order: 1, title: '第1章 初识智能体' },
  'chapter02': { order: 2, title: '第2章 智能体发展史' },
  'chapter03': { order: 3, title: '第3章 大语言模型基础' },
  'chapter04': { order: 4, title: '第4章 智能体经典范式' },
  'chapter05': { order: 5, title: '第5章 PromptX 认知系统' },
  'chapter06': { order: 6, title: '第6章 Deepractice 框架体系' },
  'chapter07': { order: 7, title: '第7章 AgentX 事件驱动框架' },
  'chapter08': { order: 8, title: '第8章 多智能体框架实践' },
  'chapter09': { order: 9, title: '第9章 Monogent 认知架构' },
  'chapter10': { order: 10, title: '第10章 上下文工程' },
  'chapter11': { order: 11, title: '第11章 智能体通信协议' },
  'chapter12': { order: 12, title: '第12章 Agentic-RL' },
  'chapter13': { order: 13, title: '第13章 智能体性能评估' },
  'chapter14': { order: 14, title: '第14章 智能旅行助手' },
  'chapter15': { order: 15, title: '第15章 自动化深度研究' },
  'chapter16': { order: 16, title: '第16章 构建赛博小镇' }
}

/**
 * 生成侧边栏配置
 */
export function generateSidebar(): DefaultTheme.Sidebar {
  return {
    '/docs/': [
      {
        text: '开始阅读',
        items: [
          { text: '前言', link: '/docs/preface' }
        ]
      },
      {
        text: '第一部分：智能体与LLM基础',
        collapsed: false,
        items: [
          { text: '第1章 初识智能体', link: '/docs/chapter01/' },
          { text: '第2章 智能体发展史', link: '/docs/chapter02/' },
          { text: '第3章 大语言模型基础', link: '/docs/chapter03/' }
        ]
      },
      {
        text: '第二部分：构建AI智能体',
        collapsed: false,
        items: [
          { text: '第4章 智能体经典范式', link: '/docs/chapter04/' },
          { text: '第5章 PromptX 认知系统', link: '/docs/chapter05/' },
          { text: '第6章 Deepractice 框架体系', link: '/docs/chapter06/' },
          { text: '第7章 AgentX 事件驱动框架', link: '/docs/chapter07/' },
          { text: '第8章 多智能体框架实践', link: '/docs/chapter08/' }
        ]
      },
      {
        text: '第三部分：高级知识扩展',
        collapsed: true,
        items: [
          { text: '第9章 Monogent 认知架构', link: '/docs/chapter09/' },
          { text: '第10章 上下文工程', link: '/docs/chapter10/' },
          { text: '第11章 智能体通信协议', link: '/docs/chapter11/' },
          { text: '第12章 Agentic-RL', link: '/docs/chapter12/' },
          { text: '第13章 智能体性能评估', link: '/docs/chapter13/' }
        ]
      },
      {
        text: '第四部分：综合案例进阶',
        collapsed: true,
        items: [
          { text: '第14章 智能旅行助手', link: '/docs/chapter14/' },
          { text: '第15章 自动化深度研究', link: '/docs/chapter15/' },
          { text: '第16章 构建赛博小镇', link: '/docs/chapter16/' }
        ]
      }
    ],
    '/learning-map/': [
      {
        text: '学习地图',
        items: [
          { text: '入门路径', link: '/learning-map/#入门路径' },
          { text: '进阶路径', link: '/learning-map/#进阶路径' },
          { text: '项目实战', link: '/learning-map/#项目实战' },
          { text: '高级扩展', link: '/learning-map/#高级扩展' },
          { text: '毕业设计', link: '/learning-map/#毕业设计' }
        ]
      }
    ],
    '/resources/': [
      {
        text: '资源库',
        items: [
          { text: '资源总览', link: '/resources/' }
        ]
      }
    ]
  }
}

export { chapterConfigs }
