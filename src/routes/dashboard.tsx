import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { getAdmin, saveSiteContent } from "@/lib/content.functions";
import { HIDEABLE_PAGES, validateCatalog, type SiteContent } from "@/lib/content";
import { CatalogEditor } from "@/components/CatalogEditor";
import { Button } from "@/components/ui/button";
import { useContent } from "@/hooks/use-content";
import { Badge, Panel, btn } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const ERRORS: Record<string, string> = {
  denied: "That Discord account isn't allowed to manage this site.",
  state: "Sign-in expired. Please try again.",
  token: "Discord sign-in failed. Check the redirect link in your Discord app settings.",
  config: "The Discord secret isn't set up yet.",
};

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): { error?: string | undefined } => ({
    error: typeof s["error"] === "string" ? (s["error"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dashboard — BlanK-VisionS" },
      { name: "description", content: "Owner dashboard for editing the BlanK-VisionS website." },
      { property: "og:title", content: "Dashboard — BlanK-VisionS" },
      { property: "og:description", content: "Owner dashboard for the BlanK-VisionS website." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: () => getAdmin(),
  component: Dashboard,
});

function Dashboard() {
  const admin = Route.useLoaderData();
  const { error } = Route.useSearch();
  if (!admin) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <Badge>Owner only</Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with your Discord account to edit the website.</p>
        {error && <p className="mt-4 text-xs text-destructive">{ERRORS[error] ?? "Sign-in failed."}</p>}
        <a href="/api/public/discord/login" className={cn(btn("primary"), "mt-6")}>Sign in with Discord</a>
      </section>
    );
  }
  return <Editor admin={admin} />;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
const input = "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <button type="button" onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-surface-2">
      <span className={on ? "text-foreground" : "text-muted-foreground line-through"}>{label}</span>
      <span className={cn("font-mono text-[10px] uppercase", on ? "text-primary" : "text-muted-foreground")}>{on ? "visible" : "hidden"}</span>
    </button>
  );
}

function Editor({ admin }: { admin: { name: string; avatar: string | null } }) {
  const initial = useContent();
  const [c, setC] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const save = useServerFn(saveSiteContent);
  const router = useRouter();
  const set = <K extends keyof SiteContent>(k: K, v: SiteContent[K]) => setC((p) => ({ ...p, [k]: v }));
  const toggle = (k: "hiddenPages" | "hiddenModules" | "hiddenCommands", id: string) =>
    set(k, c[k].includes(id) ? c[k].filter((x) => x !== id) : [...c[k], id]);

  async function onSave() {
    setSaving(true);
    try {
      await save({ data: validateCatalog(c) });
      await router.invalidate();
      toast.success("Saved — the public site is updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {admin.avatar && <img src={admin.avatar} alt="" className="h-8 w-8 rounded-full border border-border" />}
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Signed in as {admin.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="/api/public/discord/logout" className={btn("outline", "sm")}>Sign out</a>
          <Button onClick={onSave} disabled={saving} className={cn(btn("primary", "sm"), "shadow-none disabled:opacity-50")}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Announcement banner" meta={c.banner.enabled ? "on" : "off"}>
          <div className="space-y-3 p-3">
            <Toggle on={c.banner.enabled} onChange={(v) => set("banner", { ...c.banner, enabled: v })} label="Show banner at top of every page" />
            <Field label="Text"><input className={input} value={c.banner.text} onChange={(e) => set("banner", { ...c.banner, text: e.target.value })} /></Field>
          </div>
        </Panel>

        <Panel title="Home page" meta="hero">
          <div className="space-y-3 p-3">
            <Field label="Badge"><input className={input} value={c.hero.badge} onChange={(e) => set("hero", { ...c.hero, badge: e.target.value })} /></Field>
            <Field label="Headline"><input className={input} value={c.hero.title} onChange={(e) => set("hero", { ...c.hero, title: e.target.value })} /></Field>
            <Field label="Headline (gray line)"><input className={input} value={c.hero.titleMuted} onChange={(e) => set("hero", { ...c.hero, titleMuted: e.target.value })} /></Field>
            <Field label="Subtitle"><textarea rows={3} className={input} value={c.hero.subtitle} onChange={(e) => set("hero", { ...c.hero, subtitle: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Uptime"><input className={input} value={c.stats.uptime} onChange={(e) => set("stats", { ...c.stats, uptime: e.target.value })} /></Field>
              <Field label="Price"><input className={input} value={c.stats.price} onChange={(e) => set("stats", { ...c.stats, price: e.target.value })} /></Field>
            </div>
          </div>
        </Panel>

        <Panel title="Links" meta="buttons">
          <div className="space-y-3 p-3">
            <Field label="Invite link"><input className={input} value={c.links.invite} onChange={(e) => set("links", { ...c.links, invite: e.target.value })} /></Field>
            <Field label="Support server"><input className={input} value={c.links.support} onChange={(e) => set("links", { ...c.links, support: e.target.value })} /></Field>
            <Field label="Vote link"><input className={input} value={c.links.vote} onChange={(e) => set("links", { ...c.links, vote: e.target.value })} /></Field>
          </div>
        </Panel>

        <Panel title="Pages" meta={`${c.hiddenPages.length} hidden`}>
          <div className="divide-y divide-border">
            {HIDEABLE_PAGES.map((p) => (
              <Toggle key={p.to} on={!c.hiddenPages.includes(p.to)} onChange={() => toggle("hiddenPages", p.to)} label={p.label} />
            ))}
          </div>
        </Panel>
      </div>

      <fieldset disabled={saving}><CatalogEditor content={c} onChange={setC} /></fieldset>
    </section>
  );
}
