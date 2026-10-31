import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-kit";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — BlanK-VisionS" },
      { name: "description", content: "Answers to common questions about BlanK-VisionS." },
      { property: "og:title", content: "FAQ — BlanK-VisionS" },
      { property: "og:description", content: "Answers to common questions about BlanK-VisionS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Faq,
});

const Q = [
  ["Is BlanK-VisionS free?", "Yes. Every module is free, with no premium tier or hidden fees."],
  ["Does it support slash commands?", "Every command works both as a slash command and with your custom prefix."],
  ["Does AltVerify store my IP?", "No. Only a one-way SHA-256 hash is stored; your real IP cannot be recovered."],
  ["Can I disable modules?", "Yes. Each module is isolated and can be turned off without affecting the rest."],
  ["What permissions does it need?", "Only what each module requires. Administrator is not mandatory but simplifies setup."],
  ["How do I request data deletion?", "Join the support server and open a ticket — we'll remove your server's data."],
];

function Faq() {
  return (
    <>
      <PageHeader eyebrow="Help" title="Frequently asked questions" />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="divide-y divide-border rounded-lg border border-border bg-surface">
          {Q.map(([q, a]) => (
            <details key={q} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium group-open:text-primary">
                {q}
                <span className="font-mono text-xs text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Still stuck?{" "}
          <a href={SITE.support} target="_blank" rel="noreferrer" className="text-foreground underline decoration-border underline-offset-4 hover:text-primary">
            Ask in the support server ↗
          </a>
        </p>
      </div>
    </>
  );
}
