import { useEffect, useRef } from "react";

/** Page-specific canvas animation layered behind content. */
export function AmbientCanvas({ mode }: { mode: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const red = mode === "blocked";
    const col = (a: number) => (red ? `rgba(255,90,80,${a})` : `rgba(0,255,215,${a})`);
    void css;
    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999 };
    const resize = () => {
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    addEventListener("resize", resize);
    addEventListener("pointermove", onMove);

    // constellation particles
    const N = Math.min(90, Math.floor((w * h) / 16000));
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    }));
    // code rain columns
    const cols = Array.from({ length: Math.floor(w / 28) }, () => ({ y: Math.random() * h, s: 0.6 + Math.random() * 1.4 }));
    const glyphs = "/01<>{}#$_=+abcdef".split("");

    const constellation = () => {
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140) { p.x += dx / d; p.y += dy / d; }
      }
      for (let i = 0; i < N; i++) {
        const a = pts[i]!;
        for (let j = i + 1; j < N; j++) {
          const b = pts[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = col(0.18 * (1 - d / 130));
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.fillStyle = col(0.55);
        ctx.fillRect(a.x - 1, a.y - 1, 2, 2);
      }
    };

    const rain = () => {
      ctx.font = "12px 'Geist Mono', monospace";
      cols.forEach((c, i) => {
        c.y += c.s;
        if (c.y > h + 200) c.y = -200;
        for (let k = 0; k < 10; k++) {
          ctx.fillStyle = col(0.28 * (1 - k / 10));
          ctx.fillText(glyphs[(i * 7 + k + Math.floor(t / 12)) % glyphs.length]!, i * 28 + 8, c.y - k * 16);
        }
      });
    };

    const waves = () => {
      for (let l = 0; l < 5; l++) {
        ctx.strokeStyle = col(0.08 + l * 0.04);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const y = h * 0.55 + Math.sin(x * 0.006 + t * 0.012 + l) * (30 + l * 14) + Math.sin(x * 0.013 - t * 0.02) * 12 + (l - 2) * 40;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    };

    const pulse = () => {
      const cx = w / 2, cy = h * 0.35;
      for (let i = 0; i < 4; i++) {
        const r = ((t * 1.2 + i * 120) % 480);
        ctx.strokeStyle = col(0.3 * (1 - r / 480));
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      }
      // heartbeat line
      ctx.strokeStyle = col(0.35); ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const ph = (x - t * 3) % 300;
        const y = h * 0.75 + (ph > 120 && ph < 160 ? Math.sin((ph - 120) / 40 * Math.PI * 2) * -40 : 0);
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    };

    const radar = () => {
      const cx = w / 2, cy = h * 0.42, R = Math.min(w, h) * 0.42;
      ctx.strokeStyle = col(0.12);
      for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(cx, cy, (R * i) / 4, 0, Math.PI * 2); ctx.stroke(); }
      const a = t * 0.02;
      for (let k = 0; k < 40; k++) {
        ctx.strokeStyle = col(0.3 * (1 - k / 40));
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a - k * 0.02) * R, cy + Math.sin(a - k * 0.02) * R); ctx.stroke();
      }
    };

    const grid = () => {
      const g = 40, off = (t * 0.3) % g;
      for (let x = -g; x < w + g; x += g)
        for (let y = -g; y < h + g; y += g) {
          const px = x + off, py = y + off;
          const d = Math.hypot(px - mouse.x, py - mouse.y);
          const a = 0.08 + Math.max(0, 1 - d / 220) * 0.5 + Math.sin((px + py) * 0.01 + t * 0.03) * 0.04;
          ctx.fillStyle = col(a);
          ctx.fillRect(px, py, 1.5, 1.5);
        }
    };

    const draw =
      mode === "home" ? constellation :
      mode === "commands" ? rain :
      mode === "features" || mode === "credits" ? waves :
      mode === "status" ? pulse :
      mode === "verify" || mode === "blocked" ? radar :
      grid;

    const loop = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
    };
  }, [mode]);

  return <canvas ref={ref} className="ambient-canvas absolute inset-0 h-full w-full" />;
}
