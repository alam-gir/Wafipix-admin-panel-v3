import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
  asChild?: boolean
}

const getVariantStyles = (variant: ButtonProps["variant"] = "default") => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
    outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
    link: "text-primary underline-offset-4 hover:underline",
  }
  return variants[variant]
}

const getSizeStyles = (size: ButtonProps["size"] = "default") => {
  const sizes = {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
    icon: "size-9",
    "icon-sm": "size-8",
    "icon-lg": "size-10",
  }
  return sizes[size]
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
    
    const buttonStyles = cn(
      baseStyles,
      getVariantStyles(variant),
      getSizeStyles(size),
      className
    )

    if (asChild && React.isValidElement(children)) {
      // If asChild is true, clone the child element and apply our styles
      const childElement = children as React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>
      return React.cloneElement(childElement, {
        className: cn(buttonStyles, childElement.props.className),
        ref,
        ...props,
      })
    }

    return (
      <button
        data-slot="button"
        className={buttonStyles}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

// Export buttonVariants function for compatibility with existing code
const buttonVariants = (options: { variant?: ButtonProps["variant"]; size?: ButtonProps["size"]; className?: string }) => {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    getVariantStyles(options.variant),
    getSizeStyles(options.size),
    options.className
  )
}

export { Button, buttonVariants }