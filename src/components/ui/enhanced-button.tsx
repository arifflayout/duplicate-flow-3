import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200",
        primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md focus:shadow-lg transition-all duration-200",
        destructive: "bg-destructive-500 text-white hover:bg-destructive-600 active:bg-destructive-700 shadow-sm hover:shadow-md transition-all duration-200",
        outline: "border border-neutral-300 bg-background text-neutral-700 hover:bg-neutral-50 hover:border-primary-300 hover:text-primary-700 active:bg-neutral-100 transition-all duration-200",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md transition-all duration-200",
        ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success-500 text-white hover:bg-success-600 active:bg-success-700 shadow-sm hover:shadow-md transition-all duration-200",
        warning: "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 shadow-sm hover:shadow-md transition-all duration-200",
        info: "bg-info-500 text-white hover:bg-info-600 active:bg-info-700 shadow-sm hover:shadow-md transition-all duration-200",
        gradient: "bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg hover:shadow-xl transition-all duration-200",
        "gradient-cool": "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border border-primary-200 hover:from-primary-100 hover:to-secondary-100 hover:border-primary-300 transition-all duration-200",
        "glass": "bg-background/80 backdrop-blur-sm border border-neutral-200/50 text-foreground hover:bg-background/90 hover:border-neutral-300/50 transition-all duration-200",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {children}
      </Comp>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, enhancedButtonVariants }