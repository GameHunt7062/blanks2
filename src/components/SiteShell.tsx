import { Link, useLocation, type LinkProps } from "@tanstack/react-router";
import { useContent } from "@/hooks/use-content";
import { useState, type ReactNode } from "react";
import { NAV, SITE } from "@/lib/site";
import { CommandMenu, useCommandMenu } from "./CommandMenu";
import { btn } from "./ui-kit";
import { AmbientBg } from "./AmbientBg";
import { cn } from "@/lib/utils";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/BlanK.png" alt="BlanK-VisionS logo" className="h-6 w-6 rounded border border-border" />
      <span className="text-sm font-semibold tracking-tight">{SITE.name}</span>
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { open, setOpen } = useCommandMenu();
  const [mobile, setMobile] = useState(false);
  const content = useContent();
  const { pathname } = useLocation();
  const hidden = content.hiddenPages;
  const nav = NAV.filter((n) => !hidden.includes(n.to));
  const pageHidden = hidden.some((h) => pathname === h || pathname.startsWith(h + "/"));

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <AmbientBg />
      {content.banner.enabled && content.banner.text && (
        <div className="border-b border-border bg-accent px-4 py-1.5 text-center text-xs text-primary">{content.banner.text}</div>
      )}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-6xl items-center gap-6 px-4 md:px-6">
          <Logo />
          <nav className="hidden items-center gap-0.5 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="relative rounded px-2.5 py-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "!text-foreground bg-surface-2" }}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    {isActive && (
                      <span className="absolute inset-x-2.5 -bottom-[11px] h-px bg-primary" />
                    )}
                  </>
                )}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="hidden h-7 items-center gap-6 rounded-md border border-border bg-background px-2 text-xs text-muted-foreground transition-colors hover:border-primary sm:flex"
            >
              <span>Search…</span>
              <span className="flex gap-0.5">
                <span className="kbd">⌘</span>
                <span className="kbd">K</span>
              </span>
            </button>
            <a href={content.links.invite} target="_blank" rel="noreferrer" className={btn("primary", "sm")}>
              Add to Server
            </a>
            <button
              onClick={() => setMobile((m) => !m)}
              className={cn(btn("outline", "sm"), "md:hidden")}
              aria-label="Menu"
            >
              ≡
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="grid border-t border-border md:hidden">
            {[...nav, { to: "/privacy" as const, label: "Privacy" }, { to: "/terms" as const, label: "Terms" }].filter((n) => !hidden.includes(n.to)).map(
              (n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMobile(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  className="border-b border-border px-4 py-2.5 text-sm text-muted-foreground"
                  activeProps={{ className: "!text-primary" }}
                >
                  {n.label}
                </Link>
              ),
            )}
            <button
              onClick={() => {
                setMobile(false);
                setOpen(true);
              }}
              className="px-4 py-2.5 text-left text-sm text-muted-foreground"
            >
              Search…
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1">
        {pageHidden ? (
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <h1 className="text-xl font-semibold tracking-tight">This page isn't available</h1>
            <p className="mt-2 text-sm text-muted-foreground">It's currently hidden. Check back later.</p>
            <Link to="/" className={btn("outline", "sm") + " mt-6"}>Go home</Link>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-muted-foreground">
              Modular, reliable Discord automation. Free forever.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="live-dot" /> All systems operational
            </div>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["/features", "Features"],
              ["/commands", "Commands"],
              ["/status", "Status"],
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              ["/faq", "FAQ"],
              ["/credits", "Credits"],
            ]}
            ext={[
              [SITE.support, "Support Server"],
              [SITE.vote, "Vote on top.gg"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["/privacy", "Privacy Policy"],
              ["/terms", "Terms of Service"],
            ]}
          />
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 font-mono text-[10px] text-muted-foreground md:px-6">
            <span>© {new Date().getFullYear()} {SITE.name}</span>
            <span>Not affiliated with Discord Inc.</span>
          </div>
        </div>
      </footer>

      <CommandMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function FooterCol({
  title,
  links,
  ext = [],
}: {
  title: string;
  links: [NonNullable<LinkProps["to"]>, string][];
  ext?: [string, string][];
}) {
  return (
    <div>
      <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <ul className="space-y-2 text-sm">
        {links.map(([to, l]) => (
          <li key={to}>
            <Link to={to} className="text-muted-foreground transition-colors hover:text-primary">
              {l}
            </Link>
          </li>
        ))}
        {ext.map(([href, l]) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {l} ↗
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
