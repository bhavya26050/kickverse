import * as React from "react"
import { cn } from "@/lib/utils"

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
  children?: React.ReactNode
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  children,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "relative",
        orientation === "horizontal" ? "w-full my-6" : "h-full mx-2",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-white/20"></span>
      </div>
      {children && (
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-white/70">{children}</span>
        </div>
      )}
    </div>
  )
}