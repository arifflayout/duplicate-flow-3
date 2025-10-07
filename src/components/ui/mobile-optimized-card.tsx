import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const mobileCardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-md",
        mobile: "rounded-lg shadow-sm hover:shadow-md border-border/30",
        "mobile-list": "rounded-lg shadow-sm hover:shadow-md border-border/30 hover:border-primary/20",
        "mobile-feature": "rounded-xl shadow-lg border-0 bg-gradient-to-br from-card to-surface-50",
        touch: "rounded-xl shadow-md active:scale-95 transition-transform duration-150",
      },
      spacing: {
        default: "p-6",
        compact: "p-4",
        "mobile-sm": "p-3",
        "mobile-md": "p-4",
        "mobile-lg": "p-6",
        touch: "p-4 min-h-[44px]", // WCAG touch target size
      },
      responsive: {
        default: "",
        stack: "flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4",
        grid: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
      }
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
      responsive: "default"
    },
  }
)

export interface MobileCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mobileCardVariants> {
  touchOptimized?: boolean;
}

const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, variant, spacing, responsive, touchOptimized, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        mobileCardVariants({ variant: touchOptimized ? "touch" : variant, spacing, responsive }),
        touchOptimized && "cursor-pointer select-none",
        className
      )}
      {...props}
    />
  )
)
MobileCard.displayName = "MobileCard"

// Mobile-optimized header
const MobileCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5",
      compact ? "p-3 pb-2" : "p-4 pb-2 md:p-6 md:pb-4",
      className
    )}
    {...props}
  />
))
MobileCardHeader.displayName = "MobileCardHeader"

// Mobile-optimized content
const MobileCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      compact ? "p-3 pt-0" : "p-4 pt-0 md:p-6 md:pt-0",
      className
    )} 
    {...props} 
  />
))
MobileCardContent.displayName = "MobileCardContent"

// Mobile-optimized actions
const MobileCardActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 border-t border-border/50 bg-surface-50/50",
      compact ? "p-3" : "p-4 md:p-6",
      className
    )}
    {...props}
  />
))
MobileCardActions.displayName = "MobileCardActions"

export { 
  MobileCard, 
  MobileCardHeader, 
  MobileCardContent, 
  MobileCardActions,
  mobileCardVariants 
}