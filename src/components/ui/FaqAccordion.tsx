import type { ReactNode } from "react";

export type FaqItem = { q: ReactNode; a: ReactNode };

type Props = {
  /** id of the accordion; item panels get ids `${id}-1`, `${id}-2`, … unless itemIds are given. */
  id: string;
  items: FaqItem[];
  /** Panel ids (when the page used its own numbering). */
  itemIds?: string[];
  /** Heading level of each question (h3 on most pages). */
  headingLevel?: "h2" | "h3" | "h4";
};

/**
 * Bootstrap 5 accordion (expand/collapse handled by Bootstrap's data API, loaded in SiteEffects).
 * Server-rendered, so every question and answer is in the HTML for search engines.
 */
export default function FaqAccordion({ id, items, itemIds, headingLevel: Heading = "h3" }: Props) {
  return (
    <div className="accordion accordion-flush" id={id}>
      {items.map((item, i) => {
        const panelId = itemIds?.[i] ?? `${id}-${i + 1}`;
        return (
          <div className="accordion-item" key={panelId}>
            <Heading className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${panelId}`}
                aria-expanded="false"
                aria-controls={panelId}
              >
                <strong>{item.q}</strong>
              </button>
            </Heading>
            <div id={panelId} className="accordion-collapse collapse" data-bs-parent={`#${id}`}>
              <div className="accordion-body">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
