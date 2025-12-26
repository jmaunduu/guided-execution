import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-button",
      destructive: "bg-danger text-danger-foreground hover:opacity-90 rounded-button shadow-danger",
      outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-button",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-button",
      ghost: "hover:bg-accent hover:text-accent-foreground rounded-button",
      link: "text-primary underline-offset-4 hover:underline",
      // Magolla Farm custom variants
      success: "bg-success text-success-foreground hover:opacity-90 rounded-button shadow-success",
      warning: "bg-warning text-warning-foreground hover:opacity-90 rounded-button",
      fab: "rounded-full shadow-lg hover:scale-105",
      fabSuccess: "bg-success text-success-foreground rounded-full shadow-success hover:scale-105",
      fabDanger: "bg-danger text-danger-foreground rounded-full shadow-danger hover:scale-105"
    },
    size: {
      default: "h-11 px-6 py-3",
      sm: "h-9 px-4 py-2 text-xs",
      lg: "h-12 px-8 py-3",
      icon: "h-10 w-10",
      fab: "h-14 w-14 p-0",
      fabSm: "h-10 w-10 p-0"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return;
});
Button.displayName = "Button";
export { Button, buttonVariants };