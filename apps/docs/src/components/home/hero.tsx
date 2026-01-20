import { Button } from '@deepractice/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-32">
      {/* Background Ambient Glows - The "Atmosphere" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-200/20 via-transparent to-transparent dark:from-brand-900/20 pointer-events-none" />

      <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-10">
        
        {/* Badge / Pill */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-100/50 dark:bg-surface-800/50 border border-surface-200/50 dark:border-surface-700/50 backdrop-blur-md text-xs font-medium text-surface-600 dark:text-surface-300 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Deepractice Agentic System v1.0
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="text-surface-900 dark:text-surface-50 block mb-2">构建未来的</span>
          <span className="text-gradient-brand">智能体架构</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          不仅仅是教程，而是一套关于 LLM、Prompt Engineering 与 Autonomous Agents 的深度实践方法论。
          <span className="hidden md:inline"> 从零构建高可用、可扩展的 AI 生产力系统。</span>
        </p>

        {/* Action Dock */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link href="/docs">
            <Button size="lg" className="rounded-full px-8 shadow-glow-sm hover:shadow-glow-lg transition-shadow">
              开始阅读
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
          <Link href="https://github.com/deepractice" target="_blank">
            <Button variant="ghost" size="lg" className="rounded-full px-8 text-surface-600 dark:text-surface-400 hover:bg-surface-100/50">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub 仓库
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Decorative Grid - Bottom Fade */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
    </section>
  )
}
