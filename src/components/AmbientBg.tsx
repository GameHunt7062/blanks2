import { useEffect, useRef } from "react";
import { AmbientCanvas } from "./AmbientCanvas";
import { useLocation } from "@tanstack/react-router";

type V = { hue: string; x: string; y: string; speed: number; spot: number };

const P = "var(--primary)";
const VARIANTS: Record<string, V> = {
  home: { hue: P, x: "50%", y: "-10%", speed: 40, spot: 1 },
  commands: { hue: P, x: "15%", y: "0%", speed: 60, spot: 0.7 },
  features: { hue: P, x: "85%", y: "0%", speed: 50, spot: 0.8 },
  status: { hue: P, x: "50%", y: "0%", speed: 30, spot: 0.6 },
  verify: { hue: P, x: "50%", y: "10%", speed: 35, spot: 0.8 },
  blocked: { hue: "var(--destructive)", x: "50%", y: "10%", speed: 35, spot: 0.6 },
  legal: { hue: "var(--muted-foreground)", x: "50%", y: "-20%", speed: 80, spot: 0.4 },
  dashboard: { hue: P, x: "100%", y: "0%", speed: 70, spot: 0.5 },
  default: { hue: P, x: "50%", y: "-10%", speed: 60, spot: 0.6 },
};

function pick(path: string) {
  if (path === "/") return "home";
  if (path.startsWith("/verify/blocked")) return "blocked";
  if (path.startsWith("/verify")) return "verify";
  if (path.startsWith("/privacy") || path.startsWith("/terms")) return "legal";
  const k = path.split("/")[1] ?? "";
  return k in VARIANTS ? k : "default";
}

export function AmbientBg() {
  const { pathname } = useLocation();
  const key = pick(pathname);
  const v = VARIANTS[key]!;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, tx = 50, ty = 30, cx = 50, cy = 30;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / innerWidth) * 100;
      ty = (e.clientY / innerHeight) * 100;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty("--mx", `${cx}%`);
      el.style.setProperty("--my", `${cy}%`);
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="ambient-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--hue" as string]: v.hue, ["--ox" as string]: v.x, ["--oy" as string]: v.y }}
    >
      <div key={key} className="aurora" style={{ animationDuration: `${Math.round(v.speed/2)}s, 1.6s` }} />
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <AmbientCanvas mode={key} />
      <div className="spotlight" style={{ opacity: v.spot }} />
      <div className="beam" />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
