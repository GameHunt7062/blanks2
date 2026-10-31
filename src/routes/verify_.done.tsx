import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, ExtLink } from "@/components/ui-kit";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/verify_/done")({
  head: () => ({
    meta: [
      { title: "You're verified — BlanK-VisionS" },
      { name: "description", content: "Your Verified role has been granted. Head back to Discord — you now have full access." },
      { property: "og:title", content: "You're verified — BlanK-VisionS" },
      { property: "og:description", content: "Your Verified role has been granted. Head back to Discord — you now have full access." },
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
      <div className="animate-in-up"><Badge>verified</Badge></div>
      <h1 className="animate-in-up mt-4 text-3xl font-semibold tracking-tight">You're verified</h1>
      <p className="mt-3 text-sm text-muted-foreground">Your Verified role has been granted. Head back to Discord — you now have full access.</p>
      <div className="mt-6 flex gap-2">
        <Link to="/" className="inline-flex h-9 items-center rounded-md border border-border bg-surface px-3.5 text-sm hover:border-primary hover:text-primary">Home</Link>
        <ExtLink href={SITE.support}>Support ↗</ExtLink>
      </div>
    </section>
  );
}
