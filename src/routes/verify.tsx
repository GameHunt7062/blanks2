import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, ExtLink } from "@/components/ui-kit";
import { SITE, VERIFY_API } from "@/lib/site";

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>): { token?: string | undefined } => ({
    token: typeof s["token"] === "string" ? (s["token"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Verify your account — BlanK-VisionS AltVerify" },
      { name: "description", content: "Complete the one-time AltVerify check to access your Discord server." },
      { property: "og:title", content: "Verify your account — BlanK-VisionS" },
      { property: "og:description", content: "One-time, privacy-first alt detection for Discord servers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Verify,
});

const STEPS = ["Open link", "Verify", "Get access"];

function Verify() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  async function submit() {
    setBusy(true); setErr(null);
    try {
      const r = await fetch(`${VERIFY_API}/verify/submit`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }),
      });
      const j = await r.json();
      if (j.success) navigate({ to: "/verify/done" });
      else if (j.blocked) navigate({ to: "/verify/blocked" });
      else setErr(j.error ?? "Verification failed.");
    } catch {
      setErr("Could not reach the verification server. Try again shortly.");
    } finally { setBusy(false); }
  }
  return (
    <section className="mx-auto max-w-xl px-4 py-16 md:px-6">
      <Badge className="animate-in-up">AltVerify System</Badge>
      <h1 className="animate-in-up mt-4 text-3xl font-semibold tracking-tight">Verify your account</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Complete this one-time check to access the server. Your IP is used only to detect duplicate
        accounts and is never stored in plain text.
      </p>
      <ol className="animate-in-up mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {STEPS.map((t, i) => (
          <li key={t} className="bg-surface px-3 py-3">
            <div className="font-mono text-[10px] text-muted-foreground">0{i + 1}</div>
            <div className={"mt-1 text-sm " + (i === 1 ? "text-primary" : "text-foreground")}>{t}</div>
          </li>
        ))}
      </ol>
      <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm">
        {token ? (
          <>
            <div className="font-mono text-xs text-muted-foreground">token:{token.slice(0, 8)}…</div>
            <p className="mt-2 text-foreground">Personal link detected. Click below to verify.</p>
            <button onClick={submit} disabled={busy} className="mt-3 inline-flex h-9 items-center rounded-md border border-foreground bg-foreground px-3.5 text-sm font-medium text-background transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50">
              {busy ? "Verifying…" : "Verify me"}
            </button>
            {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
          </>
        ) : (
          <>
            <div className="font-medium text-foreground">No verification link found</div>
            <p className="mt-1 text-muted-foreground">Use the link sent to you in Discord. Do not navigate here directly.</p>
          </>
        )}
      </div>
      <div className="mt-6 flex gap-2 text-xs">
        <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>·
        <Link to="/terms" className="text-muted-foreground hover:text-primary">Terms</Link>·
        <Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy</Link>·
        <ExtLink href={SITE.support} size="sm" variant="ghost">Support</ExtLink>
      </div>
    </section>
  );
}
