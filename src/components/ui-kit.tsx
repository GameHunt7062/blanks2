import type { ReactNode, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
const variants: Record<Variant, string> = {
  primary:
    "bg-foreground text-background border-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground",
  outline:
    "bg-surface text-foreground border-border hover:border-primary hover:text-primary",
  ghost: "border-transparent text-muted-foreground hover:text-primary",
};

export function btn(variant: Variant = "outline", size: "sm" | "md" = "md") {
  return cn(
    "inline-flex items-center gap-2 rounded-md border font-medium transition-colors",
    size === "sm" ? "h-7 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
    variants[variant],
  );
}

export function ExtLink({
  variant = "outline",
  size = "md",
  className,
  ...p
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: "sm" | "md" }) {
  return (
    <a target="_blank" rel="noreferrer" className={cn(btn(variant, size), className)} {...p} />
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "badge-accent inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

export function Panel({
  title,
  meta,
  children,
  className,
}: {
  title?: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface", className)}>
      {title && (
        <div className="flex h-9 items-center justify-between border-b border-border px-3">
          <span className="text-xs font-medium text-foreground">{title}</span>
          {meta && <span className="font-mono text-[10px] text-muted-foreground">{meta}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <div className="animate-in-up mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        {desc && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
        {children}
      </div>
    </div>
  );
}
