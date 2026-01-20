import { forwardRef, type HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    // Base structural styles - maximizing the "Bento" feel
    const baseStyles = 'rounded-2xl transition-all duration-300 relative overflow-hidden'

    // Variants mapped to our new CSS system
    const variants = {
      default: 'matte-card bg-surface-0/60 dark:bg-surface-100/60',
      elevated: 'matte-card shadow-elevation-2 hover:shadow-elevation-3 bg-surface-0 dark:bg-surface-100',
      outlined: 'border border-surface-200 dark:border-surface-300 bg-transparent hover:bg-surface-50 dark:hover:bg-surface-900',
      glass: 'glass border-none shadow-lg',
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
        {/* Subtle Gradient Overlay for that "Premium" sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 pointer-events-none transition-opacity duration-500 hover:opacity-100 dark:from-white/5" />
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 pb-2 ${className}`} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-2 ${className}`} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 pt-0 flex items-center gap-4 ${className}`} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
