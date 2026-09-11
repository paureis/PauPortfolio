import type { ReactNode } from "react";
import type { Station as StationContent } from "@/content/types";

// One station of the document: a section with the heading from the content
// model. Every station after the hero renders through this so the reading
// order, the anchor, and the heading level are the same everywhere.
export function Station({ station, children }: { station: StationContent; children: ReactNode }) {
  return (
    <section className="station" id={station.anchor} aria-labelledby={`${station.anchor}-heading`}>
      <h2 id={`${station.anchor}-heading`} className="station-heading">
        {station.title}
      </h2>
      {children}
    </section>
  );
}
