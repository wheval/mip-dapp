import * as React from "react";

import { cn } from "@/src/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "font-medium bg-background/50 border-border/50 focus:border-primary",
      },
      inputSize: {
        default: "h-12 text-lg px-3 py-2",
        lg: "h-14",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  handleChange?: (props: any) => void;
  labelIcon?: React.ReactNode;
  showBadge?: boolean;
}

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & InputProps
>(({ className, variant, inputSize, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, inputSize, className }))}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
