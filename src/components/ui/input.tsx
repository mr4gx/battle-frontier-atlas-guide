
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-atl-light-purple bg-white/10 px-3 py-2 text-base text-black ring-offset-atl-primary-purple placeholder:text-atl-light-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atl-primary-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
