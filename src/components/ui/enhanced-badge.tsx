import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const enhancedBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md",
        primary: "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100 hover:border-primary-300",
        secondary: "border-transparent bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm hover:shadow-md",
        destructive: "border-transparent bg-destructive-500 text-white hover:bg-destructive-600 shadow-sm hover:shadow-md",
        outline: "text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400",
        success: "bg-success-50 text-success-700 border-success-200 hover:bg-success-100 hover:border-success-300",
        warning: "bg-warning-50 text-warning-700 border-warning-200 hover:bg-warning-100 hover:border-warning-300",
        error: "bg-destructive-50 text-destructive-700 border-destructive-200 hover:bg-destructive-100 hover:border-destructive-300",
        info: "bg-info-50 text-info-700 border-info-200 hover:bg-info-100 hover:border-info-300",
        neutral: "bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200 hover:border-neutral-300",
        gradient: "bg-gradient-to-r from-primary-500 to-accent-500 text-white border-0 hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl",
        "gradient-cool": "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200 hover:from-primary-100 hover:to-secondary-100",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

export interface EnhancedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedBadgeVariants> {
  icon?: React.ReactNode
}

function EnhancedBadge({ className, variant, size, icon, children, ...props }: EnhancedBadgeProps) {
  return (
    <div className={cn(enhancedBadgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </div>
  )
}

export { EnhancedBadge, enhancedBadgeVariants }