import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cmdKey, commandSchema, featureSchema, moduleSchema, type SiteContent } from "@/lib/content";

type Draft = { kind: "feature" | "module" | "command"; id: string; moduleId?: string | undefined; originalName?: string; title: string; code: string; desc: string; isNew: boolean };
const input = "w-full min-w-0 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

export function CatalogEditor({ content: c, onChange }: { content: SiteContent; onChange: (content: SiteContent) => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [deletion, setDeletion] = useState<{ label: string; run: () => void } | null>(null);
  const open = (d: Draft) => { setError(""); setDraft(d); };
  const add = (kind: Draft["kind"], moduleId?: string) => open({ kind, id: crypto.randomUUID(), moduleId, title: "", code: "", desc: "", isNew: true });
  const toggle = (key: "hiddenFeatures" | "hiddenModules" | "hiddenCommands", id: string) => onChange({ ...c, [key]: c[key].includes(id) ? c[key].filter((v) => v !== id) : [...c[key], id] });

  function apply() {
    if (!draft) return;
    const d = draft;
    if (d.kind === "feature") {
      const result = featureSchema.safeParse({ id: d.id, title: d.title, code: d.code, desc: d.desc });
      if (!result.success) { setError("Enter a title, short code, and description."); return; }
      onChange({ ...c, features: d.isNew ? [...c.features, result.data] : c.features.map((f) => f.id === d.id ? result.data : f) });
    } else if (d.kind === "module") {
      const old = c.modules.find((m) => m.id === d.id);
      const result = moduleSchema.safeParse({ id: d.id, title: d.title, commands: old?.commands ?? [] });
      if (!result.success) { setError("Enter a module title."); return; }
      onChange({ ...c, modules: d.isNew ? [...c.modules, result.data] : c.modules.map((m) => m.id === d.id ? result.data : m) });
    } else {
      const module = c.modules.find((m) => m.id === d.moduleId);
      if (!module) return;
      const result = commandSchema.safeParse({ name: d.title, desc: d.desc });
      if (!result.success) { setError("Enter a command name and description."); return; }
      if (module.commands.some((cmd) => cmd.name === result.data.name && (d.isNew || cmd.name !== d.originalName))) {
        setError("A command with this name already exists in this module."); return;
      }
      const oldKey = cmdKey(module.id, d.originalName ?? "");
      onChange({ ...c, modules: c.modules.map((m) => m.id !== module.id ? m : { ...m, commands: d.isNew ? [...m.commands, result.data] : m.commands.map((cmd) => cmd.name === d.originalName ? result.data : cmd) }),
        hiddenCommands: c.hiddenCommands.map((k) => k === oldKey ? cmdKey(module.id, result.data.name) : k) });
    }
    setDraft(null);
  }

  const icon = (label: string, onClick: () => void, destructive = false) => <Button type="button" variant="ghost" size="icon" title={label} aria-label={label} className={destructive ? "shrink-0 text-muted-foreground hover:text-destructive" : "shrink-0 text-muted-foreground"} onClick={onClick}>{destructive ? <Trash2 /> : <Pencil />}</Button>;
  const search = query.trim().toLowerCase();

  return <div className="mt-10 space-y-10">
    <section>
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-medium">Features <span className="ml-2 font-mono text-xs text-muted-foreground">{c.features.length}</span></h2><Button type="button" size="sm" variant="outline" className="shadow-none" onClick={() => add("feature")}><Plus /> Add feature</Button></div>
      <div className="divide-y divide-border border-y border-border">
        {c.features.map((f) => <div key={f.id} className="flex items-center gap-3 py-3">
          <span className="hidden w-10 shrink-0 font-mono text-[10px] text-primary sm:block">{f.code}</span>
          <div className="min-w-0 flex-1"><h3 className="break-words text-sm font-medium">{f.title}</h3><p className="mt-1 break-words text-xs text-muted-foreground">{f.desc}</p></div>
          <Switch aria-label={`Show feature ${f.title}`} checked={!c.hiddenFeatures.includes(f.id)} onCheckedChange={() => toggle("hiddenFeatures", f.id)} className="shadow-none" />
          {icon(`Edit feature ${f.title}`, () => open({ kind: "feature", id: f.id, title: f.title, code: f.code, desc: f.desc, isNew: false }))}
          {icon(`Delete feature ${f.title}`, () => setDeletion({ label: f.title, run: () => onChange({ ...c, features: c.features.filter((e) => e.id !== f.id), hiddenFeatures: c.hiddenFeatures.filter((id) => id !== f.id) }) }), true)}
        </div>)}
        {!c.features.length && <p className="py-6 text-sm text-muted-foreground">No features.</p>}
      </div>
    </section>
    <section>
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-medium">Modules & commands</h2><Button type="button" size="sm" variant="outline" className="shadow-none" onClick={() => add("module")}><Plus /> Add module</Button></div>
      <input className={`${input} mb-4`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a module or command…" aria-label="Find a module or command" />
      <div className="divide-y divide-border border-y border-border">
        {c.modules.filter((m) => !search || `${m.title} ${m.commands.map((cmd) => `${cmd.name} ${cmd.desc}`).join(" ")}`.toLowerCase().includes(search)).map((m) => <details key={m.id} open={search ? true : undefined} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-3 py-4"><span className="font-mono text-muted-foreground group-open:rotate-90">›</span><span className="min-w-0 flex-1 break-words text-sm font-medium">{m.title}</span><span className="font-mono text-xs text-muted-foreground">{m.commands.length}</span></summary>
          <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
            <Switch aria-label={`Show module ${m.title}`} checked={!c.hiddenModules.includes(m.id)} onCheckedChange={() => toggle("hiddenModules", m.id)} className="shadow-none" /><span className="mr-auto text-xs text-muted-foreground">{c.hiddenModules.includes(m.id) ? "Hidden" : "Visible"}</span>
            <Button type="button" variant="outline" size="sm" className="shadow-none" onClick={() => add("command", m.id)}><Plus /> Add command</Button>
            {icon(`Edit module ${m.title}`, () => open({ kind: "module", id: m.id, title: m.title, code: "", desc: "", isNew: false }))}
            {icon(`Delete module ${m.title}`, () => setDeletion({ label: `${m.title} and its ${m.commands.length} commands`, run: () => onChange({ ...c, modules: c.modules.filter((e) => e.id !== m.id), hiddenModules: c.hiddenModules.filter((id) => id !== m.id), hiddenCommands: c.hiddenCommands.filter((k) => !k.startsWith(`${m.id}::`)) }) }), true)}
          </div>
          {m.commands.filter((cmd) => !search || m.title.toLowerCase().includes(search) || `${cmd.name} ${cmd.desc}`.toLowerCase().includes(search)).map((cmd) => <div key={cmd.name} className="flex items-center gap-2 border-b border-border py-3 last:border-0">
            <div className="min-w-0 flex-1"><code className="break-words font-mono text-xs">{cmd.name}</code><p className="mt-1 break-words text-xs text-muted-foreground">{cmd.desc}</p></div>
            <Switch aria-label={`Show command ${cmd.name}`} checked={!c.hiddenCommands.includes(cmdKey(m.id, cmd.name))} onCheckedChange={() => toggle("hiddenCommands", cmdKey(m.id, cmd.name))} className="shadow-none" />
            {icon(`Edit command ${cmd.name}`, () => open({ kind: "command", id: m.id, moduleId: m.id, originalName: cmd.name, title: cmd.name, desc: cmd.desc, code: "", isNew: false }))}
            {icon(`Delete command ${cmd.name}`, () => setDeletion({ label: cmd.name, run: () => onChange({ ...c, modules: c.modules.map((e) => e.id !== m.id ? e : { ...e, commands: e.commands.filter((x) => x.name !== cmd.name) }), hiddenCommands: c.hiddenCommands.filter((k) => k !== cmdKey(m.id, cmd.name)) }) }), true)}
          </div>)}
          {!m.commands.length && <p className="py-4 text-sm text-muted-foreground">No commands.</p>}
        </details>)}
        {!c.modules.length && <p className="py-6 text-sm text-muted-foreground">No modules.</p>}
      </div>
    </section>
    <Dialog open={!!draft} onOpenChange={(open) => { if (!open) setDraft(null); }}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg bg-surface shadow-none">
        <DialogTitle>{draft?.isNew ? "Add" : "Edit"} {draft?.kind}</DialogTitle><DialogDescription className="sr-only">Catalog entry</DialogDescription>
        {draft && <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); apply(); }}>
          <label className="block space-y-1 text-xs text-muted-foreground">{draft.kind === "command" ? "Command name" : "Title"}<input autoFocus required maxLength={200} className={input} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
          {draft.kind === "feature" && <label className="block space-y-1 text-xs text-muted-foreground">Short code<input required maxLength={12} className={input} value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} /></label>}
          {draft.kind !== "module" && <label className="block space-y-1 text-xs text-muted-foreground">Description<textarea required maxLength={2000} rows={4} className={input} value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} /></label>}
          {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" onClick={() => setDraft(null)}>Cancel</Button><Button type="submit" variant="outline" className="shadow-none">Apply</Button></div>
        </form>}
      </DialogContent>
    </Dialog>
    <Dialog open={!!deletion} onOpenChange={(open) => { if (!open) setDeletion(null); }}>
      <DialogContent className="w-[calc(100%-2rem)] rounded-lg bg-surface shadow-none"><DialogTitle>Delete {deletion?.label}?</DialogTitle><DialogDescription>This entry will be removed when you save changes.</DialogDescription><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeletion(null)}>Cancel</Button><Button variant="outline" className="text-destructive shadow-none" onClick={() => { deletion?.run(); setDeletion(null); }}>Delete</Button></div></DialogContent>
    </Dialog>
  </div>;
}