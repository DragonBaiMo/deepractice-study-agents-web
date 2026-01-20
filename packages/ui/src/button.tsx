import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    // Structural & Physical base
    const baseStyles = [
      'inline-flex items-center justify-center font-semibold',
      'transition-all duration-200 ease-spring', // Using our custom spring physics
      'active:scale-95 hover:-translate-y-0.5', // Tactile feedback
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50 disabled:grayscale',
      'cursor-pointer select-none'
    ].join(' ')

    const variants = {
      primary: [
        'bg-brand-600 text-white',
        'hover:bg-brand-500 hover:shadow-glow-sm',
        'focus-visible:ring-brand-500',
        'shadow-md shadow-brand-500/20'
      ].join(' '),
      secondary: [
        'bg-surface-100 text-surface-900',
        'hover:bg-surface-200 hover:text-black',
        'dark:bg-surface-800 dark:text-surface-100 dark:hover:bg-surface-700',
        'focus-visible:ring-surface-400'
      ].join(' '),
      ghost: [
        'bg-transparent text-surface-600',
        'hover:bg-surface-100 hover:text-brand-600',
        'dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-brand-400',
        'focus-visible:ring-surface-400'
      ].join(' '),
      outline: [
        'border border-surface-200 bg-transparent text-surface-700',
        'hover:border-brand-300 hover:text-brand-600 hover:bg-surface-50',
        'dark:border-surface-700 dark:text-surface-300 dark:hover:border-brand-700 dark:hover:bg-surface-900',
        'focus-visible:ring-surface-400'
      ].join(' '),
      glass: [
        'glass text-surface-900',
        'hover:bg-white/40 dark:hover:bg-black/40',
        'border border-white/20'
      ].join(' ')
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
      md: 'h-10 px-5 text-sm rounded-xl gap-2',
      lg: 'h-12 px-8 text-base rounded-2xl gap-2.5',
      icon: 'h-10 w-10 p-0 rounded-xl',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
