import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Tag } from "@/components/ui-kit";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Credits — BlanK-VisionS" },
      { name: "description", content: "The people and open-source projects behind BlanK-VisionS." },
      { property: "og:title", content: "Credits — BlanK-VisionS" },
      { property: "og:description", content: "The people and open-source projects behind BlanK-VisionS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Credits,
});

const TEAM = [
  ["GameHunt7062", "Founder · Lead Developer", "github.com/GameHunt7062"],
  ["BlanK-VisionS Team", "Development & Support", "discord.gg/3MJAYraXu8"],
];
const STACK = ["discord.js / discord.py", "Discord API", "top.gg", "Open-source community"];

function Credits() {
  return (
    <>
      <PageHeader eyebrow="Thanks" title="Credits" desc="BlanK-VisionS is built and maintained by a small team, standing on the shoulders of open source." />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-2 md:px-6">
        <Panel title="Team" meta={`${TEAM.length} members`}>
          <div className="divide-y divide-border">
            {TEAM.map(([n, r, l]) => (
              <div key={n} className="flex items-center gap-3 px-3 py-3">
                <span className="grid h-8 w-8 place-items-center rounded border border-border-strong bg-surface-2 font-mono text-xs text-primary">
                  {n?.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{n}</div>
                  <div className="text-xs text-muted-foreground">{r}</div>
                </div>
                <span className="ml-auto truncate font-mono text-[10px] text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Built with" meta="thanks ♥">
          <div className="flex flex-wrap gap-2 p-3">
            {STACK.map((s) => <Tag key={s}>{s}</Tag>)}
          </div>
          <p className="border-t border-border px-3 py-3 text-xs text-muted-foreground">
            And every server owner who reported a bug or{" "}
            <a href={SITE.vote} target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">voted on top.gg</a>.
          </p>
        </Panel>
      </div>
    </>
  );
}
