import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  "animate-pulse bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]",
  {
    variants: {
      variant: {
        default: "rounded-md",
        text: "rounded-sm h-4",
        avatar: "rounded-full",
        card: "rounded-xl",
        button: "rounded-lg",
        input: "rounded-lg h-12",
      },
      size: {
        sm: "h-4",
        default: "h-6",
        lg: "h-8",
        xl: "h-12",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Shimmer keyframe
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

// Pre-built skeleton components
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("space-y-4 p-6 bg-card rounded-xl border", className)}>
    <Skeleton variant="avatar" className="w-12 h-12" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full h-3" />
      <Skeleton variant="text" className="w-5/6 h-3" />
      <Skeleton variant="text" className="w-4/6 h-3" />
    </div>
    <div className="flex justify-between">
      <Skeleton variant="button" className="w-20 h-8" />
      <Skeleton variant="button" className="w-24 h-8" />
    </div>
  </div>
);

const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={cn("space-y-4", className)}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" className="h-6" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonList: React.FC<{ items?: number; showAvatar?: boolean; className?: string }> = ({ 
  items = 5, 
  showAvatar = true, 
  className 
}) => (
  <div className={cn("space-y-4", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4">
        {showAvatar && <Skeleton variant="avatar" className="w-10 h-10" />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonMetrics: React.FC<{ count?: number; className?: string }> = ({ 
  count = 4, 
  className 
}) => (
  <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="p-6 bg-card rounded-xl border space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton variant="avatar" className="w-8 h-8" />
          <Skeleton variant="text" className="w-12 h-4" />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" className="w-16 h-8" />
          <Skeleton variant="text" className="w-24 h-3" />
        </div>
      </div>
    ))}
  </div>
);

// Inject shimmer keyframes into the document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonTable, 
  SkeletonList, 
  SkeletonMetrics,
  skeletonVariants 
};