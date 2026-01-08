'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-surface-50 to-surface-100 dark:from-brand-950/20 dark:via-surface-0 dark:to-surface-100" />
        <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-50 dark:opacity-30" aria-hidden="true">
          <div
            className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-brand-200 to-brand-400"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-full bg-brand-50/50 px-3 py-1 text-sm font-medium text-brand-700 ring-1 ring-inset ring-brand-200/50 backdrop-blur-sm dark:bg-brand-900/10 dark:text-brand-300 dark:ring-brand-500/20">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500"></span>
            智能体工程化实战指南 v2.0
          </span>
        </motion.div>

        <motion.h1
          className="mt-8 text-5xl font-bold tracking-tight text-text-primary sm:text-7xl lg:text-8xl drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          构建下一代
          <span className="relative whitespace-nowrap px-2">
            <span className="absolute -inset-1 -skew-y-3 bg-gradient-to-r from-brand-500/20 to-brand-300/20 blur-xl dark:from-brand-500/10 dark:to-brand-300/10"></span>
            <span className="relative bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent dark:from-brand-400 dark:to-brand-300">
              AI 智能体
            </span>
          </span>
          系统
        </motion.h1>

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          掌控 AgentX 与 PromptX，从基础认知到生产级架构，
          <br className="hidden sm:block" />
          系统化学习智能体开发的完整知识体系
        </motion.p>

        <motion.div
          className="mt-10 flex items-center justify-center gap-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/docs/chapter-01"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition-all duration-300 hover:scale-[1.02] hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              立即开始学习
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </Link>
          <Link
            href="/learning-map"
            className="group flex items-center gap-2 rounded-xl bg-surface-0 px-6 py-3.5 text-sm font-semibold text-text-secondary shadow-sm ring-1 ring-inset ring-surface-200 transition-all duration-300 hover:bg-surface-50 hover:text-text-primary hover:ring-surface-300 active:scale-95 dark:bg-surface-100 dark:ring-surface-700 dark:hover:bg-surface-200"
          >
            查看学习路径
            <span className="text-text-tertiary transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 border-t border-surface-200/50 pt-10 dark:border-surface-300/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { label: '章节', value: '16' },
            { label: '核心概念', value: '60+' },
            { label: '代码示例', value: '100+' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center group cursor-default">
              <span className="text-4xl font-bold text-brand-600 sm:text-5xl transition-all duration-500 group-hover:scale-110 group-hover:text-brand-500 dark:text-brand-400">
                {stat.value}
              </span>
              <span className="mt-2 text-sm font-medium text-text-tertiary group-hover:text-text-secondary transition-colors">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
