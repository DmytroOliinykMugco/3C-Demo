import { cn } from "@/lib/utils"

const Badge = ({ children, variant = "default", className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-blue-100 text-blue-800",
        variant === "secondary" && "bg-gray-100 text-gray-800",
        className
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
