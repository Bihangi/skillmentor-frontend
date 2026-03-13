import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/15 text-destructive",
        outline: "text-foreground border-border",
        glow: "border-primary/30 bg-primary/10 text-primary shadow-[0_0_10px_hsl(172_66%_50%/0.15)]",
        success: "border-transparent bg-[hsl(152_69%_45%/0.15)] text-[hsl(152_69%_45%)]",
        warning: "border-transparent bg-[hsl(38_92%_50%/0.15)] text-[hsl(38_92%_50%)]",
        info: "border-transparent bg-[hsl(199_89%_48%/0.15)] text-[hsl(199_89%_48%)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
