import type { ReactNode } from "react";
import { StageLock } from "@/app/components/StageLock";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

/** Full-viewport page: title + description on the left, arbitrary content on the right. */
export function SplitPage({ title, description, children }: Props) {
  return (
    <main className="split-stage">
      <StageLock />
      <section className="split">
        <div className="split__text">
          <h1 className="section-title">{title}</h1>
          <p className="split__desc">{description}</p>
        </div>
        <div className="split__content">{children}</div>
      </section>
    </main>
  );
}
