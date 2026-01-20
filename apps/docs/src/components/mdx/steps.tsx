import { type ReactNode } from 'react'

interface StepsProps {
  children: ReactNode
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="steps-container my-12 ml-4 [counter-reset:step]">
      {children}
    </div>
  )
}

interface StepProps {
  title?: string
  children: ReactNode
}

export function Step({ title, children }: StepProps) {
  return (
    <div className="step relative pl-10 pb-12 last:pb-0 [counter-increment:step]">
      {/* Vertical Line */}
      <div className="absolute left-[11px] top-3 bottom-0 w-[2px] bg-gradient-to-b from-surface-200 via-surface-200 to-transparent dark:from-surface-700 dark:via-surface-800 last:hidden" />

      {/* Step Indicator */}
      <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-surface-0 dark:bg-surface-900 border border-brand-200 dark:border-brand-800 shadow-[0_0_10px_-2px_rgba(99,102,241,0.3)] z-10 transition-transform duration-300 hover:scale-110">
         <span className="text-xs font-bold text-brand-600 dark:text-brand-400 font-mono before:content-[counter(step)]" />
      </div>

      {title && (
        <h4 className="mb-3 text-lg font-bold text-surface-900 dark:text-surface-100 tracking-tight leading-none mt-[-2px]">{title}</h4>
      )}
      <div className="text-surface-600 dark:text-surface-400 leading-relaxed [&>p]:mt-2 text-base">{children}</div>
    </div>
  )
}

Steps.Step = Step
