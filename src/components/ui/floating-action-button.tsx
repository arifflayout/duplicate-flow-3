import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Plus, X } from "lucide-react"

const fabVariants = cva(
  "fixed z-50 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer select-none active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-success/20",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-warning/20",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20",
        gradient: "gradient-primary text-white hover:opacity-90 shadow-primary/30",
      },
      size: {
        default: "w-14 h-14",
        sm: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  }
)

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  expanded?: boolean;
  actions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "success" | "warning" | "destructive";
  }>;
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, variant, size, position, expanded, actions, children, onClick, ...props }, ref) => {
    const [isExpanded, setIsExpanded] = React.useState(expanded || false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (actions && actions.length > 0) {
        setIsExpanded(!isExpanded);
      }
      onClick?.(e);
    };

    return (
      <div className="fixed z-50" style={{
        bottom: position?.includes('bottom') ? '24px' : undefined,
        top: position?.includes('top') ? '24px' : undefined,
        right: position?.includes('right') ? '24px' : undefined,
        left: position?.includes('left') ? '24px' : undefined,
        transform: position === 'bottom-center' ? 'translateX(-50%)' : undefined,
      }}>
        {/* Expanded Actions */}
        {actions && isExpanded && (
          <div className="flex flex-col gap-3 mb-4 items-end">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg border border-border/50 text-sm font-medium text-foreground whitespace-nowrap">
                  {action.label}
                </div>
                <button
                  onClick={action.onClick}
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95",
                    action.variant === "secondary" && "bg-secondary text-secondary-foreground",
                    action.variant === "success" && "bg-success text-success-foreground",
                    action.variant === "warning" && "bg-warning text-warning-foreground",
                    action.variant === "destructive" && "bg-destructive text-destructive-foreground",
                    (!action.variant || action.variant === "default") && "bg-card text-foreground border border-border"
                  )}
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          ref={ref}
          className={cn(fabVariants({ variant, size, position: undefined }), className)}
          onClick={handleClick}
          {...props}
        >
          {actions && actions.length > 0 ? (
            <div className={cn("transition-transform duration-300", isExpanded && "rotate-45")}>
              {isExpanded ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </div>
          ) : (
            children
          )}
        </button>

        {/* Backdrop */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-background/20 backdrop-blur-sm -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
    )
  }
)
FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton, fabVariants }