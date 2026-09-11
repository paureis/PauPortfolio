import type { Contact, Profile, Station } from "@/content/types";

// The first viewport. Name, positioning line with its tail, supporting
// line, and the two actions. Real HTML from the content model, so it is on
// screen before anything else loads.
export function Hero({
  profile,
  contact,
  station,
  workAnchor,
}: {
  profile: Profile;
  contact: Contact;
  station: Station;
  workAnchor: string;
}) {
  return (
    <header className="hero" id={station.anchor}>
      <p className="hero-name">{profile.name}</p>
      <h1 className="hero-positioning">
        {profile.positioning}, {profile.tail}.
      </h1>
      <p className="hero-supporting">{profile.supporting}</p>
      <p className="hero-actions">
        <a className="action-primary" href={`#${workAnchor}`}>
          See the work
        </a>
        <a className="action-secondary" href={contact.resume} download>
          Download resume
        </a>
      </p>
    </header>
  );
}
