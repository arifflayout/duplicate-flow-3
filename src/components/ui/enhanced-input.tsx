import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Search, Eye, EyeOff } from "lucide-react"

const inputVariants = cva(
  "flex w-full border bg-background text-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "rounded-lg px-4 py-3 border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0",
        modern: "rounded-xl px-4 py-3 bg-neutral-50 border-neutral-200 focus:bg-background focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
        search: "rounded-full px-6 py-3 bg-neutral-50 border-neutral-200 focus:bg-background focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20",
        minimal: "rounded-lg px-4 py-3 border-neutral-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30",
        glass: "rounded-lg px-4 py-3 bg-background/50 backdrop-blur-sm border-neutral-200/50 focus:bg-background/80 focus:border-primary-400",
      },
      inputSize: {
        default: "h-12 text-sm",
        sm: "h-10 text-sm",
        lg: "h-14 text-base",
        xl: "h-16 text-lg",
      },
      state: {
        default: "",
        error: "border-destructive-500 focus:ring-destructive-500/20 bg-destructive-50",
        success: "border-success-500 focus:ring-success-500/20 bg-success-50",
        warning: "border-warning-500 focus:ring-warning-500/20 bg-warning-50",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
)

export interface EnhancedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
  isLoading?: boolean;
  helperText?: string;
  label?: string;
  containerClassName?: string;
  // Legacy props for compatibility
  icon?: React.ReactNode;
  error?: string;
  helper?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    variant, 
    inputSize, 
    state, 
    type, 
    startIcon, 
    endIcon, 
    isPassword, 
    isLoading,
    helperText,
    label,
    containerClassName,
    // Legacy props
    icon,
    error,
    helper,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    
    // Handle legacy props
    const resolvedStartIcon = startIcon || icon;
    const resolvedHelperText = helperText || helper;
    const resolvedState = error ? "error" : state;
    
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    
    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <label className={cn(
            "text-sm font-medium text-foreground transition-colors",
            isFocused && "text-primary",
            resolvedState === "error" && "text-destructive",
            resolvedState === "success" && "text-success"
          )}>
            {showPassword ? <EyeOff className="h-4 w-4 text-neutral-500 hover:text-neutral-700" /> : <Eye className="h-4 w-4 text-neutral-500 hover:text-neutral-700" />}
          </label>
        )}
        
        <div className="relative">
          {resolvedStartIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {resolvedStartIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, inputSize, state: resolvedState }),
              resolvedStartIcon && "pl-10",
              (endIcon || isPassword) && "pr-10",
              isLoading && "cursor-wait",
              "shadow-sm hover:shadow-md focus:shadow-lg",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-300 border-t-primary-500" />
            </div>
          )}
          
          {isPassword && !isLoading && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          
          {endIcon && !isPassword && !isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        
        {(error || resolvedHelperText) && (
          <p className={cn(
            "text-xs",
            error && "text-destructive-600",
            resolvedState === "success" && "text-success-600",
            resolvedState === "warning" && "text-warning-600",
            (!resolvedState || resolvedState === "default") && "text-neutral-500"
          )}>
            {error || resolvedHelperText}
          </p>
        )}
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

// Search Input Component
const SearchInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ placeholder = "Search...", ...props }, ref) => (
    <EnhancedInput
      ref={ref}
      variant="search"
      startIcon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      {...props}
    />
  )
)
SearchInput.displayName = "SearchInput"

export { EnhancedInput, SearchInput, inputVariants }