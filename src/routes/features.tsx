import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Tag } from "@/components/ui-kit";
import { useContent } from "@/hooks/use-content";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — BlanK-VisionS" },
      { name: "description", content: "Invite logging, ticket system, embed builder, giveaways, anti-bot, auto roles and AltVerify." },
      { property: "og:title", content: "Features — BlanK-VisionS" },
      { property: "og:description", content: "Everything BlanK-VisionS does for your Discord server." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Features,
});

function Features() {
  const content = useContent();
  const features = content.features.filter((f) => !content.hiddenFeatures.includes(f.id));
  return (
    <>
      <PageHeader eyebrow="Platform" title="Features" desc="Isolated modules. Detailed logs. Slash and prefix support for every command." />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1 }}>
          {features.map((f) => (
            <div key={f.id} className="group min-w-0 bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-2">
              <Tag>{f.code}</Tag>
              <h3 className="mt-4 break-words text-sm font-medium group-hover:text-primary">{f.title}</h3>
              <p className="mt-1.5 break-words text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
        {!features.length && <p className="py-6 text-sm text-muted-foreground">No features listed.</p>}
      </div>
    </>
  );
}
