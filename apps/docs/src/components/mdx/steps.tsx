import { type ReactNode } from 'react'

interface StepsProps {
  children: ReactNode
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="steps-container my-8 ml-4 border-l-2 border-surface-200 pl-8 dark:border-surface-800 [counter-reset:step]">
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
    <div className="step relative pb-8 last:pb-0 [counter-increment:step]">
      {/* Step number indicator */}
      <div className="absolute -left-[43px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-surface-50 bg-brand-600 text-sm font-bold text-white shadow-sm ring-1 ring-brand-600 dark:border-surface-0 before:content-[counter(step)] dark:bg-brand-500" />

      {title && (
        <h4 className="mb-3 text-lg font-bold text-text-primary tracking-tight">{title}</h4>
      )}
      <div className="text-text-secondary leading-relaxed [&>p]:mt-0">{children}</div>
    </div>
  )
}

// Re-export Step as part of Steps
Steps.Step = Step
