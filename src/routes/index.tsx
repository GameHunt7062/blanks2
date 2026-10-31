import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { Reveal, CountUp } from "@/components/Reveal";
import { useContent } from "@/hooks/use-content";
import { visibleModules } from "@/lib/content";
import { Badge, ExtLink, Panel, Tag, btn } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BlanK-VisionS — The Discord bot I was dreaming of" },
      { name: "description", content: "Invite tracking, tickets, giveaways, embeds and AltVerify in one modular, free Discord bot." },
      { property: "og:title", content: "BlanK-VisionS — The Discord bot I was dreaming of" },
      { property: "og:description", content: "Invite tracking, tickets, giveaways, embeds and AltVerify in one modular, free Discord bot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const LOG = [
  ["19:42:01", "/altverify setup", "AltVerify configured", "ok"],
  ["19:42:07", "/ticket create", "Ticket #0042 opened", "ok"],
  ["19:42:15", "/giveaway start", "Giveaway running · 2d", "ok"],
  ["19:42:22", "/invitelog", "Tracking 18 invites", "ok"],
  ["19:42:31", "antibot add #general", "Channel protected", "ok"],
] as const;

const DETECT = [
  ["VERIFIED", "user#4821", "New join — IP verified"],
  ["BLOCKED", "alt#9934", "Matching IP — original in server"],
  ["VERIFIED", "user#1102", "Returning member — restored"],
  ["BLOCKED", "ghost#0077", "Duplicate account detected"],
] as const;

function Index() {
  const content = useContent();
  const { hero, links, stats } = content;
  const mods = visibleModules(content);
  const cmdCount = mods.reduce((n, m) => n + m.commands.length, 0);
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg animate-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:px-6 md:py-24">
          <div className="flex flex-col justify-center">
            <img src="/Blank_banner.png" alt="BlanK" className="animate-in-up mb-6 w-full max-w-sm" />
            <h1 style={{ animationDelay: "80ms" }} className="animate-in-up mt-5 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {hero.title}
              <br />
              <span className="text-muted-foreground">{hero.titleMuted}</span>
            </h1>
            <p style={{ animationDelay: "160ms" }} className="animate-in-up mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              {hero.subtitle}
            </p>
            <div style={{ animationDelay: "240ms" }} className="animate-in-up mt-7 flex flex-wrap gap-2">
              <ExtLink href={links.invite} variant="primary">Add to Server — Free</ExtLink>
              <ExtLink href={links.support}>Join Support ↗</ExtLink>
            </div>
            <div style={{ animationDelay: "320ms" }} className="animate-in-up mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="kbd">⌘</span><span className="kbd">K</span>
              <span>to search every command</span>
            </div>
          </div>

          <Panel
            title={
              <span className="flex items-center gap-2">
                <span className="live-dot" /> BlanK-VisionS · activity
              </span>
            }
            meta={`id:${SITE.clientId.slice(0, 8)}…`}
            className="animate-in-up scanline self-center [animation-delay:200ms]"
          >
            <div className="divide-y divide-border font-mono text-xs">
              {LOG.map(([t, cmd, res], i) => (
                <div key={t} style={{ animationDelay: `${500 + i * 450}ms` }} className="animate-log grid grid-cols-[64px_1fr] gap-3 px-3 py-2.5">
                  <span className="text-muted-foreground">{t}</span>
                  <div className="min-w-0">
                    <div className="truncate text-foreground">{cmd}</div>
                    <div className="truncate text-muted-foreground">
                      <span className="text-primary">→</span> {res}
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-3 py-2.5 text-muted-foreground">
                <span className="text-primary">$</span> <span className="cursor-blink" />
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-border md:grid-cols-4">
          {[
            [String(mods.length) + "+", "Modules"],
            [String(cmdCount), "Commands"],
            [stats.uptime, "Uptime"],
            [stats.price, "Forever"],
          ].map(([v, l], i) => (
            <div key={l} className={"px-4 py-6 md:px-6 " + (i > 1 ? "border-t border-border md:border-t-0" : "")}>
              <CountUp value={v ?? ""} className="block font-mono text-2xl font-medium tracking-tight" />
              <div className="mt-1 text-xs text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <Reveal>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Modules</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Enable only what you need.</h2>
          </div>
          <Link to="/commands" className={btn("outline", "sm")}>All commands →</Link>
        </div>
        <div className="grid overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1 }}>
          {mods.map((m, i) => (
            <Link
              style={{ animationDelay: `${i * 60}ms` }}
              key={m.id}
              to="/commands"
              hash={m.id}
              className="animate-in-up group relative bg-surface p-4 transition-all duration-300 hover:bg-surface-2 [&:hover_.arrow]:translate-x-0 [&:hover_.arrow]:opacity-100"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium transition-colors group-hover:text-primary">{m.title} <span className="arrow inline-block -translate-x-1 opacity-0 transition-all">→</span></span>
                <Tag>{m.commands.length} cmds</Tag>
              </div>
              <div className="mt-3 truncate font-mono text-[11px] text-muted-foreground">
                {m.commands.slice(0, 3).map((c) => c.name.split(" ").slice(0, 2).join(" ")).join(" · ")}
              </div>
            </Link>
          ))}
        </div>
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface">
        <Reveal className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">AltVerify</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Live alt detection, privacy-first.</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              New members are verified against a one-way SHA-256 hash. Your real IP is never
              stored and can never be recovered.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Modular design — toggle any module", "Rich timestamped log embeds", "Slash + custom prefix support"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-1 w-1 bg-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <Panel title="Detection stream" meta="realtime" className="bg-background">
            <div className="divide-y divide-border">
              {DETECT.map(([s, u, d], i) => (
                <div key={u} style={{ animationDelay: `${i * 600}ms`, animationIterationCount: "infinite", animationDuration: "2.4s" }} className="animate-log flex items-center gap-3 px-3 py-2.5 text-xs">
                  {s === "VERIFIED" ? (
                    <Badge>verified</Badge>
                  ) : (
                    <span className="inline-flex rounded border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-destructive">
                      blocked
                    </span>
                  )}
                  <span className="font-mono text-foreground">{u}</span>
                  <span className="ml-auto truncate text-muted-foreground">{d}</span>
                </div>
              ))}
            </div>
          </Panel>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-surface p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Ready to upgrade your server?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Free to add. No hidden fees. Works in any server.</p>
          </div>
          <div className="flex gap-2">
            <ExtLink href={links.invite} variant="primary">Add BlanK-Bot</ExtLink>
            <ExtLink href={links.vote}>Vote on top.gg</ExtLink>
          </div>
        </div>
        </Reveal>
      </section>
    </>
  );
}
