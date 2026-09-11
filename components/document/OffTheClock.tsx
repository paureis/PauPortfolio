import type { OffTheClock as OffTheClockContent, Station as StationContent } from "@/content/types";
import { Station } from "./Station";

// Station 5, the desk end. One viewport at most: four short items and the
// languages.
export function OffTheClock({ station, content }: { station: StationContent; content: OffTheClockContent }) {
  return (
    <Station station={station}>
      <p className="lead">{content.intro}</p>
      <ul className="off-the-clock">
        {content.items.map((item) => (
          <li key={item.title}>
            <span className="off-the-clock-title">{item.title}</span>
            <span className="off-the-clock-detail">{item.detail}</span>
          </li>
        ))}
      </ul>
      <p className="languages">
        {content.languages.map((language, index) => (
          <span key={language.name}>
            {index > 0 ? " " : null}
            {language.name}, {language.level.toLowerCase()}.
          </span>
        ))}
      </p>
    </Station>
  );
}
