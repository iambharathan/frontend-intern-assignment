import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-all",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-800 text-gray-100 hover:bg-gray-700",
        pending: "border-transparent bg-amber-900/50 text-amber-300 hover:bg-amber-900/70",
        progress: "border-transparent bg-blue-900/50 text-blue-300 hover:bg-blue-900/70",
        completed: "border-transparent bg-green-900/50 text-green-300 hover:bg-green-900/70",
        low: "border-transparent bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70",
        medium: "border-transparent bg-yellow-900/50 text-yellow-300 hover:bg-yellow-900/70",
        high: "border-transparent bg-red-900/50 text-red-300 hover:bg-red-900/70",
        outline: "text-gray-300 border-gray-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
