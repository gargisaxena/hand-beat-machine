import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const arcadeButton = cva(
  "relative inline-flex items-center justify-center font-display uppercase tracking-[0.22em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "border border-primary/60 bg-primary/15 text-foreground hover:bg-primary/30 hover:shadow-[0_0_28px_oklch(0.66_0.24_305/45%)]",
        cyan: "border border-accent/60 bg-accent/10 text-accent hover:bg-accent/20 hover:shadow-[0_0_24px_oklch(0.85_0.15_195/40%)]",
        ghost: "border border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-accent/60",
      },
      size: {
        lg: "px-10 py-4 text-base",
        md: "px-6 py-3 text-xs",
        sm: "px-4 py-2 text-[0.65rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof arcadeButton>;

export function ArcadeButton({ className, variant, size, ...props }: Props) {
  return <button className={cn(arcadeButton({ variant, size }), className)} {...props} />;
}
