// The shape of the site's content. Everything a visitor reads comes from one
// value of type SiteContent (content/site.ts). Components render from it and
// nothing else; content/validate.ts is the rule set the build gate enforces.

export interface Profile {
  name: string;
  shortName: string;
  location: string;
  // The hero line is positioning plus tail. The tail is the playful part and
  // can change without touching the claim.
  positioning: string;
  tail: string;
  supporting: string;
}

export interface Link {
  label: string;
  href: string;
}

export interface WorkEntry {
  id: string;
  title: string;
  // Who the work was for, when that is not the title itself.
  organization?: string;
  role: string;
  // Year-month, so the reader sees a span without a day that means nothing.
  // Optional: a product or a studio has no start date worth printing.
  start?: string;
  end?: string;
  summary: string;
  // What changed for the people who used it. At least one, always first.
  outcomes: string[];
  // The engineering choices behind the outcomes.
  decisions: string[];
  links?: Link[];
  // "resume" entries are described at resume level only and may not link out.
  // Talent Scout Pro is the reason this exists.
  visibility: "resume" | "public";
}

export interface TimelineEntry {
  organization: string;
  role: string;
  start: string;
  end?: string;
}

export interface LifecyclePhase {
  name: string;
  description: string;
}

export interface Repository {
  name: string;
  href: string;
  description: string;
}

export interface HowIWork {
  intro: string;
  lifecycle: LifecyclePhase[];
  practice: string[];
  // Hand-picked, never fetched. Empty until Pau chooses them.
  repositories: Repository[];
}

// headline: the ones a cloud or AI recruiter screens for. supporting: the
// rest of the earned professional and associate set. fundamentals: the
// entry-level exams.
export type CredentialTier = "headline" | "supporting" | "fundamentals";
export type CredentialStatus = "earned" | "in-progress";

export interface Credential {
  id: string;
  name: string;
  issuer: string;
  tier: CredentialTier;
  status: CredentialStatus;
  // Required when earned, forbidden when in progress. ISO date.
  earnedOn?: string;
  expiresOn?: string;
  // Required when earned. Where a recruiter confirms it in one click.
  verificationUrl?: string;
  // Some issuers verify through a shared page plus a code typed into it.
  verificationCode?: string;
}

export interface Education {
  school: string;
  degree: string;
  // Free text the reader sees: "2025" or "Starting spring 2027".
  when: string;
  detail?: string;
}

export interface OffTheClockItem {
  title: string;
  detail: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface OffTheClock {
  intro: string;
  items: OffTheClockItem[];
  languages: Language[];
}

export interface Contact {
  intro: string;
  email: string;
  linkedin: string;
  github: string;
  // Path under public/. The build gate checks the file exists.
  resume: string;
  // The last line on the page, so the reader knows it ended.
  closing: string;
}

export type StationId =
  | "wide"
  | "main-monitor"
  | "side-monitor"
  | "wall"
  | "desk-end"
  | "window";

export interface Station {
  id: StationId;
  // The section's heading and its entry in the navigation.
  title: string;
  // The id of the section element, used for in-page links.
  anchor: string;
}

export interface SiteContent {
  profile: Profile;
  stations: Station[];
  work: WorkEntry[];
  timeline: TimelineEntry[];
  howIWork: HowIWork;
  credentials: Credential[];
  education: Education[];
  offTheClock: OffTheClock;
  contact: Contact;
}
