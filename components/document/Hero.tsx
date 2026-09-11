import type { Contact, Profile, Station } from "@/content/types";

// The first viewport, station 1. Name and location, positioning line with
// its tail, supporting line, and the two actions. Real HTML from the
// content model, so it is on screen before anything else loads. A section
// like the other five stations, labelled by its heading.
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
    <section className="hero" id={station.anchor} aria-labelledby={`${station.anchor}-heading`}>
      <p className="hero-name">
        {profile.name} <span className="hero-location">{profile.location}</span>
      </p>
      <h1 id={`${station.anchor}-heading`} className="hero-positioning">
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
    </section>
  );
}
