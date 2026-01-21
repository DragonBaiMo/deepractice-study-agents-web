
import Link from 'next/link'
import { 
  IconCpu, 
  IconMessage, 
  IconDatabase, 
  IconApi, 
  IconUsers 
} from '@/components/icons/common'

export function BentoGrid() {
  return (
    <section className="py-24 px-4 md:px-6 relative z-10 border-t border-surface-200/60 bg-surface-50/30 dark:border-surface-800/50 dark:bg-surface-950/10">
      {/* Background decoration to link with section above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-surface-200 dark:via-surface-800 to-transparent" />

      <div className="container mx-auto max-w-7xl">
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full bg-brand-50/50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50">
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Knowledge Graph</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-surface-900 dark:text-surface-50">
            全景式<span className="text-gradient-brand">知识图谱</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
            打破碎片化学习，通过结构化的五大核心模块，从理论底层直达工程实践。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[320px]">
          
          {/* Card 1: Core Architecture (Large) */}
          <Link href="/docs/chapter-05" className="md:col-span-4 group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded-[20px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative h-full bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden group-hover:border-surface-300 dark:group-hover:border-surface-700 transition-colors">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="relative h-full p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1 space-y-6 z-10">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 ring-1 ring-brand-100 dark:ring-brand-800">
                    <IconCpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-3">AgentX 核心架构</h3>
                    <p className="text-surface-500 dark:text-surface-400 leading-relaxed">
                      深入剖析智能体的 &quot;大脑&quot; (LLM)、&quot;感知&quot; (Perception)、&quot;记忆&quot; (Memory) 与 &quot;行动&quot; (Action) 四大基石，构建可进化的认知模型。
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>开始学习</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
                
                {/* Abstract Blueprint Visualization */}
                <div className="w-full md:w-1/2 h-48 md:h-full relative opacity-80 group-hover:opacity-100 transition-opacity">
                  <svg className="absolute inset-0 w-full h-full text-surface-200 dark:text-surface-800" viewBox="0 0 400 300" fill="none">
                    <circle cx="200" cy="150" r="40" stroke="currentColor" strokeWidth="2" className="text-brand-500/20" />
                    <circle cx="200" cy="150" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                    <path d="M200 110 V70" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="160" y="30" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" className="text-surface-300 dark:text-surface-700" />
                    <path d="M200 190 V230" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="160" y="230" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" className="text-surface-300 dark:text-surface-700" />
                    <path d="M160 150 H120" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="40" y="130" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" className="text-surface-300 dark:text-surface-700" />
                    <path d="M240 150 H280" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="280" y="130" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" className="text-surface-300 dark:text-surface-700" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: PromptX */}
          <Link href="/docs/chapter-07" className="md:col-span-2 group relative">
            <div className="relative h-full bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 transition-all hover:-translate-y-1 hover:shadow-elevation-2">
              <div className="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-6 text-surface-600 dark:text-surface-400 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <IconMessage className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">PromptX 提示工程</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-6">
                告别玄学调优。掌握 CO-STAR, RTF 等结构化技巧，让模型输出稳定可控。
              </p>
              <div className="absolute bottom-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <IconMessage className="w-24 h-24" />
              </div>
            </div>
          </Link>

          {/* Card 3: RAG (Vertical) */}
          <Link href="/docs/chapter-08" className="md:col-span-2 group relative">
            <div className="relative h-full bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 transition-all hover:-translate-y-1 hover:shadow-elevation-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <IconDatabase className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">RAG 知识增强</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                构建外挂知识库，解决 LLM 幻觉问题。涵盖向量检索、混合排序与 GraphRAG。
              </p>
              <div className="mt-6 flex gap-2">
                <div className="h-1.5 w-8 bg-emerald-200 dark:bg-emerald-900 rounded-full" />
                <div className="h-1.5 w-4 bg-surface-200 dark:bg-surface-800 rounded-full" />
                <div className="h-1.5 w-12 bg-surface-200 dark:bg-surface-800 rounded-full" />
              </div>
            </div>
          </Link>

          {/* Card 4: Tool Use */}
          <Link href="/docs/chapter-09" className="md:col-span-2 group relative">
            <div className="relative h-full bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 transition-all hover:-translate-y-1 hover:shadow-elevation-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400">
                <IconApi className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">Tool Use & API</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                赋予智能体&quot;双手&quot;。Function Calling 标准范式、API 编排与沙箱环境安全执行。
              </p>
            </div>
          </Link>

          {/* Card 5: Multi-Agent */}
          <Link href="/docs/chapter-06" className="md:col-span-2 group relative">
            <div className="relative h-full bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 transition-all hover:-translate-y-1 hover:shadow-elevation-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <IconUsers className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-3">Multi-Agent 协作</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                从单体智能到群体智慧。SOP 流程编排、动态路由与复杂任务拆解策略。
              </p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
