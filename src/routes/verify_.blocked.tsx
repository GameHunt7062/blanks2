import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, ExtLink } from "@/components/ui-kit";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/verify_/blocked")({
  head: () => ({
    meta: [
      { title: "Verification blocked — BlanK-VisionS" },
      { name: "description", content: "Another account from the same network is already in this server. If this is a mistake, contact the server staff or our support." },
      { property: "og:title", content: "Verification blocked — BlanK-VisionS" },
      { property: "og:description", content: "Another account from the same network is already in this server. If this is a mistake, contact the server staff or our support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Page,
});

function Page() {
  void Badge;
  return (
    <section className="mx-auto max-w-xl px-4 py-24 md:px-6">
      <div className="animate-in-up"><span className="inline-flex rounded border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-destructive">blocked</span></div>
      <h1 className="animate-in-up mt-4 text-3xl font-semibold tracking-tight">Verification blocked</h1>
      <p className="mt-3 text-sm text-muted-foreground">Another account from the same network is already in this server. If this is a mistake, contact the server staff or our support.</p>
      <div className="mt-6 flex gap-2">
        <Link to="/" className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-3.5 text-sm hover:border-primary hover:text-primary">Home</Link>
        <ExtLink href={SITE.support}>Support ↗</ExtLink>
      </div>
    </section>
  );
}
