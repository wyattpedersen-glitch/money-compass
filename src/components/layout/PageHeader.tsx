import type { ReactNode } from "react";

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="pb-6 pt-10 sm:pt-14">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>}
    </div>
  );
}
