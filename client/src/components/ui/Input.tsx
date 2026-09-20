import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[var(--color-bg-card)] border text-[var(--color-text-primary)] text-sm rounded-lg
              focus:outline-none focus:ring-2 transition-shadow h-10
              ${icon ? 'pl-10' : 'pl-3'} pr-3
              ${error 
                ? 'border-[var(--color-accent-red)] focus:ring-[var(--color-accent-red)]/20' 
                : 'border-[var(--color-border)] focus:border-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]/20 hover:border-[var(--color-border-light)]'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-[var(--color-accent-red)] font-medium pl-1">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
