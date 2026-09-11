// Content validation rules. The build gate (scripts/check-content.mjs) and
// the tests both call validateSite, so every rule lives here once. The
// function takes unknown on purpose: the fixtures that must fail are not
// valid SiteContent, and the gate should not trust the type system for
// what it is there to catch.
//
// Rules, from the PRD and Issue 2:
// - every required text field is present and not blank
// - no phone number anywhere, at any depth (the resume PDF carries it)
// - every work entry has at least one outcome
// - resume-level work entries do not link out
// - an earned credential has an earned date and a verification link
// - an in-progress credential has no earned date
// - every contact field is present and well-formed
// - the six stations exist in story order

import type { CredentialStatus, CredentialTier, StationId } from "./types";

const STATION_ORDER: readonly StationId[] = [
  "wide",
  "main-monitor",
  "side-monitor",
  "wall",
  "desk-end",
  "window",
];
const TIERS: readonly CredentialTier[] = ["headline", "fundamentals"];
const STATUSES: readonly CredentialStatus[] = ["earned", "in-progress"];

// Ten digits in the common North American groupings, with or without an
// area-code parenthesis. Dates like 2025-03-01 do not match: the first
// group needs three digits at a word boundary followed by three more.
const PHONE_NUMBER = /(?:\(\d{3}\)|\b\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/;
const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const ISO_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Unknown = Record<string, unknown>;

function isObject(value: unknown): value is Unknown {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim().length === 0;
}

function isHttps(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

class Problems {
  readonly list: string[] = [];

  add(problem: string): void {
    this.list.push(problem);
  }

  // Requires each named field of obj to be non-blank text.
  text(obj: Unknown, path: string, fields: readonly string[]): void {
    for (const field of fields) {
      if (isBlank(obj[field])) this.add(`${path}.${field} is missing or empty`);
    }
  }

  // Requires obj[field] to be an https URL when it is present at all.
  https(obj: Unknown, path: string, field: string): void {
    if (obj[field] !== undefined && !isHttps(obj[field])) {
      this.add(`${path}.${field} must be an https URL`);
    }
  }

  // Requires a non-empty array of objects and hands each to check.
  each(value: unknown, path: string, check: (item: Unknown, itemPath: string, index: number) => void): void {
    if (!Array.isArray(value) || value.length === 0) {
      this.add(`${path} has no entries`);
      return;
    }
    value.forEach((item, index) => {
      const itemPath = `${path}[${index}]`;
      if (!isObject(item)) {
        this.add(`${itemPath} is not an object`);
        return;
      }
      check(item, itemPath, index);
    });
  }

  // Like each, but an empty array is fine.
  eachOptional(
    value: unknown,
    path: string,
    check: (item: Unknown, itemPath: string, index: number) => void,
  ): void {
    if (value === undefined) return;
    if (!Array.isArray(value)) {
      this.add(`${path} is not a list`);
      return;
    }
    if (value.length > 0) this.each(value, path, check);
  }

  // Requires every entry of a string list to be non-blank.
  strings(value: unknown, path: string): void {
    if (!Array.isArray(value)) return;
    value.forEach((item, index) => {
      if (isBlank(item)) this.add(`${path}[${index}] is missing or empty`);
    });
  }

  uniqueIds(items: Unknown[], path: string): void {
    const seen = new Set<string>();
    items.forEach((item, index) => {
      const id = item.id;
      if (typeof id !== "string") return;
      if (seen.has(id)) this.add(`${path}[${index}].id duplicates ${id}`);
      seen.add(id);
    });
  }
}

function checkLinks(problems: Problems, obj: Unknown, path: string): void {
  problems.eachOptional(obj.links, `${path}.links`, (link, linkPath) => {
    problems.text(link, linkPath, ["label", "href"]);
    problems.https(link, linkPath, "href");
  });
}

function checkProfile(problems: Problems, profile: unknown): void {
  if (!isObject(profile)) {
    problems.add("profile is missing");
    return;
  }
  problems.text(profile, "profile", ["name", "shortName", "location", "positioning", "tail", "supporting"]);
}

function checkStations(problems: Problems, stations: unknown): void {
  if (!Array.isArray(stations)) {
    problems.add("stations is missing");
    return;
  }
  const ids = stations.map((s) => (isObject(s) ? s.id : undefined));
  const inOrder =
    ids.length === STATION_ORDER.length && STATION_ORDER.every((id, i) => ids[i] === id);
  if (!inOrder) {
    problems.add(`stations must be ${STATION_ORDER.join(", ")} in that order`);
  }
  const anchors = new Set<string>();
  stations.forEach((station, index) => {
    if (!isObject(station)) return;
    const path = `stations[${index}]`;
    problems.text(station, path, ["title", "anchor"]);
    const anchor = station.anchor;
    if (typeof anchor === "string") {
      if (anchors.has(anchor)) problems.add(`${path}.anchor duplicates ${anchor}`);
      anchors.add(anchor);
    }
  });
}

function checkWork(problems: Problems, work: unknown): void {
  const entries: Unknown[] = [];
  problems.each(work, "work", (entry, path) => {
    entries.push(entry);
    const name = typeof entry.title === "string" ? entry.title : path;
    problems.text(entry, path, ["id", "title", "role", "start", "summary"]);
    if (typeof entry.start === "string" && !YEAR_MONTH.test(entry.start)) {
      problems.add(`${path}.start must be YYYY-MM`);
    }
    if (entry.end !== undefined && (typeof entry.end !== "string" || !YEAR_MONTH.test(entry.end))) {
      problems.add(`${path}.end must be YYYY-MM`);
    }
    if (!Array.isArray(entry.outcomes) || entry.outcomes.length === 0) {
      problems.add(`${path} (${name}) has no outcomes`);
    } else {
      problems.strings(entry.outcomes, `${path}.outcomes`);
    }
    problems.strings(entry.decisions, `${path}.decisions`);
    if (entry.visibility !== "resume" && entry.visibility !== "public") {
      problems.add(`${path}.visibility must be resume or public`);
    }
    if (entry.visibility === "resume" && Array.isArray(entry.links) && entry.links.length > 0) {
      problems.add(`${path} (${name}) is resume-level and may not link out`);
    } else {
      checkLinks(problems, entry, path);
    }
  });
  problems.uniqueIds(entries, "work");
}

function checkTimeline(problems: Problems, timeline: unknown): void {
  problems.each(timeline, "timeline", (entry, path) => {
    problems.text(entry, path, ["organization", "role", "start"]);
    if (typeof entry.start === "string" && !YEAR_MONTH.test(entry.start)) {
      problems.add(`${path}.start must be YYYY-MM`);
    }
    if (entry.end !== undefined && (typeof entry.end !== "string" || !YEAR_MONTH.test(entry.end))) {
      problems.add(`${path}.end must be YYYY-MM`);
    }
  });
}

function checkHowIWork(problems: Problems, howIWork: unknown): void {
  if (!isObject(howIWork)) {
    problems.add("howIWork is missing");
    return;
  }
  problems.text(howIWork, "howIWork", ["intro"]);
  problems.each(howIWork.lifecycle, "howIWork.lifecycle", (phase, path) => {
    problems.text(phase, path, ["name", "description"]);
  });
  problems.strings(howIWork.practice, "howIWork.practice");
  problems.eachOptional(howIWork.repositories, "howIWork.repositories", (repo, path) => {
    problems.text(repo, path, ["name", "href", "description"]);
    problems.https(repo, path, "href");
  });
}

function checkCredentials(problems: Problems, credentials: unknown): void {
  const entries: Unknown[] = [];
  problems.each(credentials, "credentials", (credential, path) => {
    entries.push(credential);
    const name = typeof credential.name === "string" ? credential.name : path;
    problems.text(credential, path, ["id", "name", "issuer"]);
    if (!TIERS.includes(credential.tier as CredentialTier)) {
      problems.add(`${path}.tier must be ${TIERS.join(" or ")}`);
    }
    if (!STATUSES.includes(credential.status as CredentialStatus)) {
      problems.add(`${path}.status must be ${STATUSES.join(" or ")}`);
    }
    const { earnedOn, expiresOn, verificationUrl } = credential;
    if (credential.status === "earned") {
      if (earnedOn === undefined) {
        problems.add(`${path} (${name}) is earned but has no earnedOn date`);
      }
      if (verificationUrl === undefined) {
        problems.add(`${path} (${name}) is earned but has no verificationUrl`);
      }
    }
    if (credential.status === "in-progress" && earnedOn !== undefined) {
      problems.add(`${path} (${name}) is in progress but has an earnedOn date`);
    }
    if (earnedOn !== undefined && (typeof earnedOn !== "string" || !ISO_DATE.test(earnedOn))) {
      problems.add(`${path}.earnedOn must be YYYY-MM-DD`);
    }
    if (expiresOn !== undefined && (typeof expiresOn !== "string" || !ISO_DATE.test(expiresOn))) {
      problems.add(`${path}.expiresOn must be YYYY-MM-DD`);
    } else if (typeof expiresOn === "string" && typeof earnedOn === "string" && expiresOn < earnedOn) {
      problems.add(`${path}.expiresOn is before earnedOn`);
    }
    problems.https(credential, path, "verificationUrl");
  });
  problems.uniqueIds(entries, "credentials");
}

function checkEducation(problems: Problems, education: unknown): void {
  problems.each(education, "education", (entry, path) => {
    problems.text(entry, path, ["school", "degree", "when"]);
  });
}

function checkOffTheClock(problems: Problems, offTheClock: unknown): void {
  if (!isObject(offTheClock)) {
    problems.add("offTheClock is missing");
    return;
  }
  problems.text(offTheClock, "offTheClock", ["intro"]);
  problems.each(offTheClock.items, "offTheClock.items", (item, path) => {
    problems.text(item, path, ["title", "detail"]);
  });
  problems.each(offTheClock.languages, "offTheClock.languages", (language, path) => {
    problems.text(language, path, ["name", "level"]);
  });
}

function checkContact(problems: Problems, contact: unknown): void {
  if (!isObject(contact)) {
    problems.add("contact is missing");
    return;
  }
  problems.text(contact, "contact", ["intro", "email", "linkedin", "github", "resume", "closing"]);
  if (typeof contact.email === "string" && !isBlank(contact.email) && !EMAIL.test(contact.email)) {
    problems.add("contact.email is not an email address");
  }
  for (const field of ["linkedin", "github"]) {
    if (!isBlank(contact[field])) problems.https(contact, "contact", field);
  }
  const resume = contact.resume;
  if (typeof resume === "string" && !isBlank(resume) && !/^\/[^/].*\.pdf$/.test(resume)) {
    problems.add("contact.resume must be a root-relative path to a .pdf");
  }
}

// Walks every string in the content and reports any that carries a phone
// number, with the path so it can be found.
function checkPhoneNumbers(problems: Problems, value: unknown, path: string): void {
  if (typeof value === "string") {
    if (PHONE_NUMBER.test(value)) problems.add(`${path} looks like it contains a phone number`);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => checkPhoneNumbers(problems, item, `${path}[${index}]`));
  } else if (isObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      checkPhoneNumbers(problems, item, path ? `${path}.${key}` : key);
    }
  }
}

export function validateSite(site: unknown): string[] {
  if (!isObject(site)) return ["site is not an object"];

  const problems = new Problems();
  checkProfile(problems, site.profile);
  checkStations(problems, site.stations);
  checkWork(problems, site.work);
  checkTimeline(problems, site.timeline);
  checkHowIWork(problems, site.howIWork);
  checkCredentials(problems, site.credentials);
  checkEducation(problems, site.education);
  checkOffTheClock(problems, site.offTheClock);
  checkContact(problems, site.contact);
  checkPhoneNumbers(problems, site, "");
  return problems.list;
}
