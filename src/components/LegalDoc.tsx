import type { ReactNode } from "react";
import { PageHeader } from "./ui-kit";

export type Section = { id: string; title: string; body: ReactNode };

export function LegalDoc({ title, updated, intro, sections }: { title: string; updated: string; intro: ReactNode; sections: Section[] }) {
  return (
    <>
      <PageHeader eyebrow="Legal" title={title} desc={`Last updated ${updated} · BlanK-VisionS`} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[200px_1fr] md:px-6">
        <aside className="hidden md:sticky md:top-16 md:block md:self-start">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Contents</div>
          <ol className="space-y-1 border-l border-border">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 text-[13px] text-muted-foreground hover:border-primary hover:text-primary">
                  <span className="font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span> {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>
        <article className="max-w-2xl space-y-8 text-sm leading-relaxed text-muted-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground [&_ul]:space-y-1.5 [&_a]:text-foreground [&_a:hover]:text-primary">
          <p>{intro}</p>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-20 border-t border-border pt-6">
              <h2 className="mb-3 flex items-baseline gap-3 text-base font-medium text-foreground">
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="space-y-3">{s.body}</div>
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
