import type { Contact as ContactContent, Station as StationContent } from "@/content/types";
import { Station } from "./Station";

// Station 6, the window. Email, LinkedIn, GitHub, the resume, and a last
// line so the reader knows the page ended. No form, no phone number.
export function Contact({ station, content }: { station: StationContent; content: ContactContent }) {
  return (
    <Station station={station}>
      <p className="lead">{content.intro}</p>
      <ul className="contact">
        <li>
          <a href={`mailto:${content.email}`}>{content.email}</a>
        </li>
        <li>
          <a href={content.linkedin} rel="noopener">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={content.github} rel="noopener">
            GitHub
          </a>
        </li>
        <li>
          <a href={content.resume} download>
            Resume, PDF
          </a>
        </li>
      </ul>
      <p className="closing">{content.closing}</p>
    </Station>
  );
}
