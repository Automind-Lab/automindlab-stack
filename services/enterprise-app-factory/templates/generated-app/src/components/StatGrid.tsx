import type { ReactElement } from "react";

interface StatGridProps {
  items: Array<{ label: string; value: string }>;
}

export function StatGrid({ items }: StatGridProps): ReactElement {
  return (
    <div className="stat-grid">
      {items.map((item) => (
        <article key={item.label} className="stat">
          <p>{item.label}</p>
          <strong>{item.value}</strong>
        </article>
      ))}
    </div>
  );
}
