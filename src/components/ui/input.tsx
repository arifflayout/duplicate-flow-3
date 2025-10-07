import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-neutral-300 bg-background px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-0 focus-visible:shadow-md hover:border-neutral-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
