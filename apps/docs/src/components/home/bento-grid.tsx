import { Card, CardHeader, CardContent } from '@deepractice/ui/card'
import Link from 'next/link'

export function BentoGrid() {
  return (
    <section className="py-24 px-4 md:px-6 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-surface-900 dark:text-surface-50">
            全景式<span className="text-gradient-brand">知识图谱</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400">
            打破碎片化学习，通过结构化的六大模块，从理论底层直达工程实践。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Card 1: Core - Large Span */}
          <Link href="/docs/chapter-05" className="md:col-span-2 group">
            <Card className="h-full relative overflow-hidden transition-all duration-500 group-hover:shadow-glow-sm" variant="elevated">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center mb-4 text-brand-600 dark:text-brand-400 shadow-inner">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">AgentX 核心架构</h3>
                <p className="text-surface-500 dark:text-surface-400 mt-2 max-w-md">
                  深入剖析智能体的 "大脑" (LLM)、"感知" (Perception)、"记忆" (Memory) 与 "行动" (Action) 四大基石。
                </p>
              </CardHeader>
              <CardContent className="absolute bottom-0 right-0 p-0 w-1/2 h-full hidden md:flex items-end justify-end pointer-events-none">
                 {/* Abstract UI representation */}
                 <div className="w-full h-[80%] bg-surface-50 dark:bg-surface-800/50 rounded-tl-3xl border-t border-l border-surface-200 dark:border-surface-700/50 shadow-2xl translate-y-4 translate-x-4 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform duration-500 flex flex-col p-6 space-y-3">
                    <div className="flex gap-2">
                       <div className="h-2 w-8 bg-brand-200/50 rounded-full" />
                       <div className="h-2 w-16 bg-surface-200/50 rounded-full" />
                    </div>
                    <div className="h-2 w-full bg-surface-200/30 rounded-full" />
                    <div className="h-2 w-3/4 bg-surface-200/30 rounded-full" />
                    <div className="mt-4 p-3 rounded-xl bg-surface-0 dark:bg-surface-900 border border-surface-100 dark:border-surface-700 shadow-sm flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900 flex-shrink-0" />
                       <div className="space-y-1.5 w-full">
                          <div className="h-1.5 w-12 bg-surface-300 dark:bg-surface-600 rounded-full" />
                          <div className="h-1.5 w-full bg-surface-100 dark:bg-surface-700 rounded-full" />
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 2: Prompt Engineering */}
          <Link href="/docs/chapter-07" className="md:col-span-1 group">
            <Card className="h-full transition-all duration-300 hover:-translate-y-1" variant="default">
               <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4 text-surface-600 dark:text-surface-300 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold group-hover:text-brand-600 transition-colors">PromptX 提示工程</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  告别玄学调优。掌握 CO-STAR, RTF 等结构化技巧，让模型输出稳定可控。
                </p>
                <div className="mt-6 font-mono text-xs p-3 rounded bg-surface-50 dark:bg-surface-900 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/30">
                   &gt; System: You are a helpful assistant...
                </div>
              </CardContent>
            </Card>
          </Link>

           {/* Card 3: RAG - Vertical */}
           <Link href="/docs/chapter-08" className="md:row-span-2 md:col-span-1 group">
             <Card className="h-full relative overflow-hidden transition-all duration-300" variant="elevated">
              <CardHeader>
                 <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">RAG 知识增强</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  构建外挂知识库，解决 LLM 幻觉问题。涵盖向量检索、混合排序与 GraphRAG。
                </p>
                <div className="flex-1 w-full bg-surface-50 dark:bg-surface-900 rounded-xl border border-dashed border-surface-200 dark:border-surface-700 p-4 relative overflow-hidden min-h-[120px]">
                    {/* Decorative lines mimicking data flow */}
                    <div className="absolute top-4 left-4 right-4 h-2 bg-surface-200 dark:bg-surface-800 rounded-full animate-pulse" />
                    <div className="absolute top-8 left-4 right-12 h-2 bg-surface-200 dark:bg-surface-800 rounded-full animate-pulse delay-75" />
                    <div className="absolute top-12 left-4 right-8 h-2 bg-surface-200 dark:bg-surface-800 rounded-full animate-pulse delay-150" />
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-0 dark:from-surface-950 to-transparent" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card 4: Tool Use */}
          <Link href="/docs/chapter-09" className="md:col-span-1 group">
            <Card className="h-full transition-all duration-300 hover:-translate-y-1" variant="default">
               <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Tool Use & API</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  赋予智能体"双手"。Function Calling 标准范式、API 编排与沙箱环境安全执行。
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Card 5: Multi-Agent */}
          <Link href="/docs/chapter-06" className="md:col-span-1 group">
            <Card className="h-full transition-all duration-300 hover:-translate-y-1" variant="default">
               <CardHeader>
                 <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Multi-Agent 协作</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  从单体智能到群体智慧。SOP 流程编排、动态路由与复杂任务拆解策略。
                </p>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </section>
  )
}
