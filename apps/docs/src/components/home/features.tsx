
import { Card } from '@deepractice/ui/card'
import { IconBrain, IconRocket, IconTool } from '@/components/icons/common'

export function Features() {
  return (
    <section className="py-24 px-4 md:px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Manifesto / Typography */}
          <div className="space-y-10 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50 leading-[1.1]">
              为什么选择 <br />
              <span className="text-gradient-brand">Deepractice?</span>
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed max-w-lg">
              传统的 AI 开发教程往往止步于 <code className="bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded text-sm font-mono text-brand-600 dark:text-brand-400">Hello World</code>。
              Deepractice 致力于填补<strong className="text-surface-900 dark:text-surface-100 font-semibold">理论与生产环境</strong>之间的巨大鸿沟。
            </p>
            
            <div className="space-y-8">
               {[
                 { title: "全栈视角", desc: "从 Prompt 到微调，从单体 Agent 到集群协作。" },
                 { title: "工程优先", desc: "关注可观测性、评估体系 (Eval) 与生产级部署。" },
                 { title: "最佳实践", desc: "源自一线大厂的落地经验与架构模式总结。" }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center font-mono text-lg text-surface-400 group-hover:border-brand-500 group-hover:text-brand-500 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-all duration-300 shadow-sm">
                      0{i+1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2 group-hover:text-brand-600 transition-colors">{item.title}</h3>
                      <p className="text-surface-500 dark:text-surface-400 leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right: Immersive Visual */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />

            <Card className="aspect-square w-full max-w-[500px] relative overflow-hidden flex items-center justify-center bg-surface-100/30 dark:bg-surface-900/30 border-none backdrop-blur-sm" variant="default">
               {/* Background Grid */}
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
               
               {/* Center Element - The "Core" */}
               <div className="relative z-10 w-48 h-48 rounded-[2rem] bg-surface-0 dark:bg-surface-800 shadow-float flex items-center justify-center border border-surface-100 dark:border-surface-700 animate-float">
                  <div className="absolute inset-0 rounded-[2rem] bg-brand-500/10 blur-xl -z-10" />
                  <svg className="w-20 h-20 text-brand-600 dark:text-brand-400 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
               </div>

               {/* Orbiting Elements */}
               <div className="absolute w-72 h-72 rounded-full border border-dashed border-surface-300 dark:border-surface-600/30 animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg flex items-center justify-center text-lg rotate-[0deg] animate-[spin_20s_linear_infinite_reverse]">
                    <IconBrain className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
               </div>
               <div className="absolute w-96 h-96 rounded-full border border-dashed border-surface-300 dark:border-surface-600/30 animate-[spin_25s_linear_infinite_reverse]">
                   <div className="absolute bottom-1/4 left-0 w-10 h-10 rounded-xl bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg flex items-center justify-center text-lg rotate-[45deg] animate-[spin_25s_linear_infinite]">
                     <IconTool className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                   </div>
               </div>
               <div className="absolute w-[28rem] h-[28rem] rounded-full border border-dashed border-surface-200 dark:border-surface-700/20 animate-[spin_35s_linear_infinite]">
                   <div className="absolute right-0 top-1/3 w-10 h-10 rounded-xl bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg flex items-center justify-center text-lg rotate-[-90deg] animate-[spin_35s_linear_infinite_reverse]">
                     <IconRocket className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                   </div>
               </div>

            </Card>
          </div>

        </div>
      </div>
    </section>
  )
}

