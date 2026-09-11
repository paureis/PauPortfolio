import type { HowIWork as HowIWorkContent, Station as StationContent } from "@/content/types";
import { Station } from "./Station";

// Station 3, the side monitor. The lifecycle is a real sequence, so it is
// the one place outside the timeline that gets numbers. Curated
// repositories render only once Pau has chosen them.
export function HowIWork({ station, content }: { station: StationContent; content: HowIWorkContent }) {
  return (
    <Station station={station}>
      <p className="lead">{content.intro}</p>
      <ol className="lifecycle">
        {content.lifecycle.map((phase) => (
          <li key={phase.name}>
            <span className="lifecycle-name">{phase.name}</span>
            <span className="lifecycle-description">{phase.description}</span>
          </li>
        ))}
      </ol>
      <ul className="practice">
        {content.practice.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p>
        <a href={content.source.href} rel="noopener">
          {content.source.label}
        </a>
      </p>
      {content.repositories.length > 0 ? (
        <>
          <h3 className="entry-title">Repositories worth a look</h3>
          <ul className="repositories">
            {content.repositories.map((repo) => (
              <li key={repo.href}>
                <a href={repo.href} rel="noopener">
                  {repo.name}
                </a>{" "}
                {repo.description}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Station>
  );
}
