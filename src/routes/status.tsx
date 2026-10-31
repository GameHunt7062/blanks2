import { createFileRoute } from "@tanstack/react-router";
import { useContent } from "@/hooks/use-content";
import { visibleModules } from "@/lib/content";
import { Badge, PageHeader, Panel } from "@/components/ui-kit";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Status — BlanK-VisionS" },
      { name: "description", content: "Current operational status of BlanK-VisionS modules." },
      { property: "og:title", content: "Status — BlanK-VisionS" },
      { property: "og:description", content: "Current operational status of BlanK-VisionS modules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Status,
});

function Status() {
  const content = useContent();
  const services = ["Gateway", "Slash Commands", ...visibleModules(content).map((m) => m.title)];
  return (
    <>
      <PageHeader eyebrow="System" title="Status">
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
          <span className="live-dot" />
          <span className="text-sm font-medium">All systems operational</span>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">90-day view</span>
        </div>
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <Panel title="Services" meta={`${services.length} monitored`}>
          <div className="divide-y divide-border">
            {services.map((s) => (
              <div key={s} className="flex flex-col gap-2 px-3 py-3 md:flex-row md:items-center md:gap-6">
                <span className="w-44 text-sm">{s}</span>
                <div className="flex flex-1 gap-[2px]">
                  {Array.from({ length: 60 }).map((_, i) => (
                    <span key={i} style={{ animationDelay: `${i * 15}ms` }} className="animate-in-up h-5 flex-1 rounded-[1px] bg-primary/70 transition-colors hover:bg-primary" />
                  ))}
                </div>
                <Badge>operational</Badge>
              </div>
            ))}
          </div>
        </Panel>
        <p className="mt-4 text-xs text-muted-foreground">
          Incidents are announced in the support server.
        </p>
      </div>
    </>
  );
}
