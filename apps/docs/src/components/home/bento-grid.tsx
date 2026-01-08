'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const features = [
  {
    title: '智能体基础',
    description: '理解 AI Agent 的核心概念、工作原理与 LLM 的关系',
    href: '/docs/chapter-01',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'group-hover:border-blue-500/30',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    span: 'md:col-span-2 lg:col-span-2',
  },
  {
    title: 'ReAct 范式',
    description: '推理与行动的交替循环',
    href: '/docs/chapter-04',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    gradient: 'from-violet-500/10 to-purple-500/10',
    border: 'group-hover:border-violet-500/30',
    iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    span: 'md:col-span-1 lg:col-span-1',
  },
  {
    title: 'Plan-and-Solve',
    description: '先规划后执行的策略模式',
    href: '/docs/chapter-05',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'group-hover:border-amber-500/30',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    span: 'md:col-span-1 lg:col-span-1',
  },
  {
    title: 'Reflection',
    description: '自我反思与迭代优化',
    href: '/docs/chapter-06',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'group-hover:border-emerald-500/30',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    span: 'md:col-span-1 lg:col-span-1',
  },
  {
    title: 'PromptX 框架',
    description: '结构化提示词工程与模板系统',
    href: '/docs/chapter-07',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    gradient: 'from-pink-500/10 to-rose-500/10',
    border: 'group-hover:border-pink-500/30',
    iconBg: 'bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    span: 'md:col-span-1 lg:col-span-1',
  },
  {
    title: 'Monogent 架构',
    description: '单智能体认知架构的深度解析与实现',
    href: '/docs/chapter-09',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    gradient: 'from-brand-500/10 to-brand-700/10',
    border: 'group-hover:border-brand-500/30',
    iconBg: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
    span: 'md:col-span-2 lg:col-span-2',
  },
]

export function BentoGrid() {
  return (
    <section className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            系统化学习路径
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            从基础概念到高级架构，循序渐进掌握智能体开发
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`group relative ${feature.span}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={feature.href} className="block h-full">
                <div className={`relative h-full overflow-hidden rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-surface-800 dark:bg-surface-100/50 ${feature.border}`}>
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start justify-between">
                      <div className={`inline-flex rounded-xl p-3 shadow-sm ring-1 ring-inset ring-black/5 ${feature.iconBg}`}>
                        {feature.icon}
                      </div>

                      <div className="rounded-full bg-surface-100 p-1.5 text-surface-400 transition-colors group-hover:bg-white group-hover:text-brand-500 dark:bg-surface-800 dark:group-hover:bg-surface-700 dark:group-hover:text-brand-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-brand-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-text-secondary line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
