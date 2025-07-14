import * as React from "react";

import { cn } from "@/src/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const inputAreaVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "bg-background/50 border-border/50 focus:border-primary resize-none",
      },
      inputSize: {
        default: " min-h-[80px] text-base px-3 py-2 ",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputAreaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof inputAreaVariants> {
  handleChange?: (props: any) => void;
  labelIcon?: React.ReactNode;
}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & InputAreaProps
>(({ className, variant, inputSize, ...props }, ref) => {
  return (
    <textarea
      className={cn(inputAreaVariants({ variant, inputSize, className }))}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
