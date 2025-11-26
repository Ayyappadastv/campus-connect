import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Status variants
        new: "border-transparent bg-status-new/15 text-status-new",
        "in-progress": "border-transparent bg-status-in-progress/15 text-status-in-progress",
        pending: "border-transparent bg-status-pending/15 text-status-pending",
        resolved: "border-transparent bg-status-resolved/15 text-status-resolved",
        closed: "border-transparent bg-status-closed/15 text-status-closed",
        // Priority variants
        low: "border-transparent bg-priority-low/15 text-priority-low",
        medium: "border-transparent bg-priority-medium/15 text-priority-medium",
        high: "border-transparent bg-priority-high/15 text-priority-high",
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
