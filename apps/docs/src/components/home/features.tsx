'use client'

import { motion } from 'framer-motion'

const features = [
  {
    name: '交互式代码示例',
    description: '每个核心概念都配有可运行的代码示例，边学边练，即时验证',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: '可视化流程图',
    description: '复杂的智能体执行流程通过动态图表直观呈现，降低理解门槛',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    name: '渐进式学习',
    description: '从基础到高级，每章内容环环相扣，构建完整的知识体系',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    name: '生产级实践',
    description: '不止于理论，提供真实场景的架构设计与最佳实践',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
]

export function Features() {
  return (
    <section className="bg-surface-50 px-6 py-24 dark:bg-surface-0/50 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              为什么选择 Deepractice
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              专为开发者设计的智能体学习平台
            </p>
          </motion.div>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="group relative overflow-hidden rounded-2xl bg-surface-0 p-8 shadow-sm ring-1 ring-surface-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-brand-500/20 dark:bg-surface-100/50 dark:ring-surface-800 dark:hover:bg-surface-100 dark:hover:ring-brand-500/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Decoration gradient */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50 blur-3xl transition-all duration-500 group-hover:bg-brand-100/50 dark:bg-brand-900/10 dark:group-hover:bg-brand-900/20"></div>

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200/50 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700 dark:bg-surface-200 dark:text-brand-400 dark:ring-surface-700 dark:group-hover:bg-brand-900/30">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-600 transition-colors duration-300">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
