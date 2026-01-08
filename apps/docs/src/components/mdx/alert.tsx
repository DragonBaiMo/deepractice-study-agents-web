import { type ReactNode } from 'react'
import { clsx } from 'clsx'

type AlertType = 'info' | 'warning' | 'danger' | 'tip' | 'note'

interface AlertProps {
  type?: AlertType
  title?: string
  children: ReactNode
}

const alertStyles: Record<AlertType, { container: string; icon: ReactNode; titleColor: string }> = {
  info: {
    container: 'border-blue-200/50 bg-blue-50/50 dark:border-blue-800/30 dark:bg-blue-900/10',
    icon: (
      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titleColor: 'text-blue-900 dark:text-blue-100',
  },
  warning: {
    container: 'border-amber-200/50 bg-amber-50/50 dark:border-amber-800/30 dark:bg-amber-900/10',
    icon: (
      <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    titleColor: 'text-amber-900 dark:text-amber-100',
  },
  danger: {
    container: 'border-red-200/50 bg-red-50/50 dark:border-red-800/30 dark:bg-red-900/10',
    icon: (
      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    titleColor: 'text-red-900 dark:text-red-100',
  },
  tip: {
    container: 'border-emerald-200/50 bg-emerald-50/50 dark:border-emerald-800/30 dark:bg-emerald-900/10',
    icon: (
      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    titleColor: 'text-emerald-900 dark:text-emerald-100',
  },
  note: {
    container: 'border-brand-200/50 bg-brand-50/50 dark:border-brand-800/30 dark:bg-brand-900/10',
    icon: (
      <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    titleColor: 'text-brand-900 dark:text-brand-100',
  },
}

export function Alert({ type = 'info', title, children }: AlertProps) {
  const styles = alertStyles[type]

  return (
    <div
      className={clsx(
        'my-6 rounded-xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md backdrop-blur-sm',
        styles.container
      )}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 pt-0.5">{styles.icon}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <h5 className={clsx("mb-1 font-semibold", styles.titleColor)}>{title}</h5>
          )}
          <div className="text-sm text-text-secondary leading-relaxed [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
