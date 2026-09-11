import type { Station as StationContent, TimelineEntry, WorkEntry } from "@/content/types";
import { formatSpan } from "@/lib/format";
import { Station } from "./Station";

function Entry({ entry }: { entry: WorkEntry }) {
  return (
    <article className="entry" id={`work-${entry.id}`}>
      <h3 className="entry-title">{entry.title}</h3>
      <p className="entry-role">
        {entry.role}
        {entry.start ? `, ${formatSpan(entry.start, entry.end)}` : null}
      </p>
      <p>{entry.summary}</p>
      <h4 className="entry-label">What changed</h4>
      <ul className="entry-list">
        {entry.outcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>
      {entry.decisions.length > 0 ? (
        <>
          <h4 className="entry-label">How I built it</h4>
          <ul className="entry-list">
            {entry.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        </>
      ) : null}
      {entry.links && entry.links.length > 0 ? (
        <p className="entry-links">
          {entry.links.map((link) => (
            <a key={link.href} href={link.href} rel="noopener">
              {link.label}
            </a>
          ))}
        </p>
      ) : null}
    </article>
  );
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <>
      <h3 className="entry-title">Where I have worked</h3>
      <ol className="timeline">
        {entries.map((entry) => (
          <li key={`${entry.organization}-${entry.start}`}>
            <span className="timeline-org">{entry.organization}</span>
            <span className="timeline-role">{entry.role}</span>
            <span className="timeline-when">{formatSpan(entry.start, entry.end)}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

// Station 2, the main monitor. Four work entries, Talent Scout Pro first,
// then the experience timeline. Outcomes come before decisions in every
// entry because that is the order a hiring manager reads in.
export function Work({
  station,
  entries,
  timeline,
}: {
  station: StationContent;
  entries: WorkEntry[];
  timeline: TimelineEntry[];
}) {
  return (
    <Station station={station}>
      {entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
      <Timeline entries={timeline} />
    </Station>
  );
}
