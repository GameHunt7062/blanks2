import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { NAV } from "@/lib/site";
import { useContent } from "@/hooks/use-content";
import { visibleModules } from "@/lib/content";
import { cn } from "@/lib/utils";

type Item = { label: string; hint: string; group: string; run: () => void };

export function useCommandMenu() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return { open, setOpen };
}

export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const content = useContent();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const ext = (u: string) => () => window.open(u, "_blank");
    const go = (to: string, hash?: string) => () => navigate(hash ? { to, hash } : { to });
    return [
      ...NAV.filter((n) => !content.hiddenPages.includes(n.to)).map((n) => ({ label: n.label, hint: n.to, group: "Pages", run: go(n.to) })),
      { label: "Privacy Policy", hint: "/privacy", group: "Pages", run: go("/privacy") },
      { label: "Terms of Service", hint: "/terms", group: "Pages", run: go("/terms") },
      { label: "Add to Server", hint: "invite", group: "Actions", run: ext(content.links.invite) },
      { label: "Join Support Server", hint: "discord", group: "Actions", run: ext(content.links.support) },
      { label: "Vote on top.gg", hint: "top.gg", group: "Actions", run: ext(content.links.vote) },
      ...visibleModules(content).flatMap((m) =>
        m.commands.map((c) => ({
          label: c.name,
          hint: m.title,
          group: "Commands",
          run: go("/commands", m.id),
        })),
      ),
    ];
  }, [navigate, content]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = s
      ? items.filter((i) => (i.label + " " + i.hint).toLowerCase().includes(s))
      : items.filter((i) => i.group !== "Commands");
    return list.slice(0, 40);
  }, [q, items]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);
  useEffect(() => setIdx(0), [q]);

  if (!open) return null;

  const select = (i: Item) => {
    onClose();
    i.run();
  };

  let lastGroup = "";
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border-strong bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <span className="font-mono text-xs text-primary">›</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIdx((i) => Math.min(i + 1, filtered.length - 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIdx((i) => Math.max(i - 1, 0));
              }
              if (e.key === "Enter" && filtered[idx]) select(filtered[idx]);
            }}
            placeholder="Search pages, commands, actions…"
            className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            style={{ outline: "none" }}
          />
          <span className="kbd">ESC</span>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No results for <span className="font-mono">"{q}"</span>
            </div>
          )}
          {filtered.map((i, n) => {
            const header = i.group !== lastGroup;
            lastGroup = i.group;
            return (
              <div key={i.group + i.label + n}>
                {header && (
                  <div className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {i.group}
                  </div>
                )}
                <button
                  onMouseEnter={() => setIdx(n)}
                  onClick={() => select(i)}
                  className={cn(
                    "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm",
                    n === idx ? "bg-accent text-primary" : "text-foreground",
                  )}
                >
                  <span className={i.group === "Commands" ? "font-mono text-xs" : ""}>
                    {i.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{i.hint}</span>
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="kbd">↑↓</span> navigate</span>
          <span className="flex items-center gap-1"><span className="kbd">↵</span> open</span>
        </div>
      </div>
    </div>
  );
}
