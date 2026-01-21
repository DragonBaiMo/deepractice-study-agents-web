import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '@/styles/globals.css'

import Link from 'next/link'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'Deepractice AI',
    template: '%s | Deepractice AI',
  },
  description: '构建下一代智能体系统的深度实践指南',
  keywords: ['AI', '智能体', 'Agent', 'LLM', 'PromptX', 'AgentX'],
  authors: [{ name: 'Deepractice' }],
  openGraph: {
    title: 'Deepractice AI',
    description: '构建下一代智能体系统的深度实践指南',
    type: 'website',
    locale: 'zh_CN',
  },
}

const navbar = (
  <Navbar
    logo={
      <span className="flex items-center gap-2.5 font-bold tracking-tight text-lg">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-brand-500 drop-shadow-sm"
        >
          <defs>
            <linearGradient id="logo-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-brand-400)" />
              <stop offset="100%" stopColor="var(--color-brand-600)" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="url(#logo-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="url(#logo-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="url(#logo-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-gradient">Deepractice AI</span>
      </span>
    }
    projectLink="https://github.com/deepractice"
  />
)

const footer = (
  <Footer className="relative border-t border-surface-200/60 bg-surface-50/60 dark:border-surface-800/50 dark:bg-surface-950/40">
    <div className="absolute inset-0 opacity-70 pointer-events-none bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

    <div className="relative mx-auto w-full max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-0 shadow-sm ring-1 ring-surface-200/70 dark:bg-surface-900 dark:ring-surface-800/60">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-brand-600 dark:text-brand-400"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-surface-900 dark:text-surface-100">
              Deepractice AI
            </span>
            <span className="mt-1 text-xs text-surface-500 dark:text-surface-400">
              构建下一代智能体系统的深度实践指南
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
          <a
            href="https://github.com/deepractice"
            className="text-surface-600 hover:text-brand-600 transition-colors dark:text-surface-400 dark:hover:text-brand-400"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <Link
            href="/docs/learning-map"
            className="text-surface-600 hover:text-brand-600 transition-colors dark:text-surface-400 dark:hover:text-brand-400"
          >
            学习地图
          </Link>
          <Link
            href="/docs/resources"
            className="text-surface-600 hover:text-brand-600 transition-colors dark:text-surface-400 dark:hover:text-brand-400"
          >
            资源库
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-surface-200/60 dark:border-surface-800/60 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-surface-500 dark:text-surface-500">
          MIT {new Date().getFullYear()} © Deepractice AI
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-600 font-mono">
          Docs · Nextra
        </p>
      </div>
    </div>
  </Footer>
)

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const pageMap = await getPageMap()

  return (
    <html lang="zh-CN" dir="ltr" suppressHydrationWarning>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-surface-0 text-surface-900 antialiased dark:bg-surface-0 min-h-screen">
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/deepractice/deepractice-study-agents-web/tree/main/deepractice-platform/apps/docs"
          footer={footer}
          sidebar={{
            defaultMenuCollapseLevel: 1,
            toggleButton: true,
            autoCollapse: true,
          }}
          toc={{
            backToTop: true,
            title: '页面导航',
            float: true,
          }}
          editLink="在 GitHub 上编辑此页"
          feedback={{
            content: '有问题？提交反馈',
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
