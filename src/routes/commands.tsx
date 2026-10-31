import { useContent } from "@/hooks/use-content";
import { visibleModules } from "@/lib/content";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Tag } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/commands")({
  head: () => ({
    meta: [
      { title: "Commands — BlanK-VisionS" },
      { name: "description", content: "Every BlanK-VisionS command, grouped by module exactly like the in-bot help menu." },
      { property: "og:title", content: "Commands — BlanK-VisionS" },
      { property: "og:description", content: "Every BlanK-VisionS command, grouped by module." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Commands,
});

function Commands() {
  const content = useContent();
  const VISIBLE = useMemo(() => visibleModules(content), [content]);
  const total = VISIBLE.reduce((n, m) => n + m.commands.length, 0);
  const [q, setQ] = useState("");
  const [active, setActive] = useState("all");
  const list = useMemo(() => {
    const s = q.toLowerCase();
    return VISIBLE.filter((m) => active === "all" || m.id === active)
      .map((m) => ({
        ...m,
        commands: m.commands.filter((c) => (c.name + c.desc).toLowerCase().includes(s)),
      }))
      .filter((m) => m.commands.length);
  }, [q, active, VISIBLE]);

  return (
    <>
      <PageHeader
        eyebrow={`${total} commands · ${VISIBLE.length} modules`}
        title="Commands"
        desc="The full command list, grouped exactly like the in-bot help menu. Every command works as a slash command and with your custom prefix."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[200px_1fr] md:px-6">
        <aside className="md:sticky md:top-16 md:self-start">
          <div className="flex gap-1 overflow-x-auto md:flex-col">
            {[{ id: "all", title: "All modules", commands: [] as unknown[] }, ...VISIBLE].map((m) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 rounded border px-2.5 py-1.5 text-left text-[13px] transition-colors",
                  active === m.id
                    ? "border-primary/30 bg-accent text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {m.title}
                <span className="hidden font-mono text-[10px] md:inline">
                  {m.id === "all" ? total : m.commands.length}
                </span>
              </button>
            ))}
          </div>
        </aside>
        <div>
          <div className="mb-4 flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-3 focus-within:border-primary">
            <span className="font-mono text-xs text-muted-foreground">/</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter commands…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ outline: "none" }}
            />
          </div>
          <div className="space-y-4">
            {list.map((m) => (
              <section key={m.id} id={m.id} className="scroll-mt-20 overflow-hidden rounded-lg border border-border bg-surface">
                <div className="flex h-9 items-center justify-between border-b border-border px-3">
                  <h2 className="text-xs font-medium">{m.title}</h2>
                  <Tag>{m.commands.length}</Tag>
                </div>
                <div className="divide-y divide-border">
                  {m.commands.map((c) => (
                    <div key={c.name} className="grid gap-1 px-3 py-2 sm:grid-cols-[280px_1fr] sm:gap-4">
                      <code className="min-w-0 break-words font-mono text-xs text-foreground">{c.name}</code>
                      <span className="min-w-0 break-words text-xs text-muted-foreground">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
            {list.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No commands match <span className="font-mono">"{q}"</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
