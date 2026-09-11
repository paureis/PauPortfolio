import type { Profile } from "./profile";

// Content validation rules. The build gate (scripts/check-content.mjs) and
// the tests both call this, so the rules live in one place. Issue 2 extends
// it with the full set from the PRD: earned credential without a date,
// in-progress credential with a date, work entry without outcomes, missing
// verification link, missing contact field.

export const REQUIRED_PROFILE_FIELDS = [
  "name",
  "shortName",
  "location",
  "positioning",
  "supporting",
] as const satisfies readonly (keyof Profile)[];

// Ten digits in the common North American groupings. The site must never
// carry a phone number; the resume PDF does.
const PHONE_NUMBER = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;

export function validateProfile(profile: unknown): string[] {
  if (profile === null || typeof profile !== "object") {
    return ["profile is not an object"];
  }

  const fields = profile as Record<string, unknown>;
  const problems: string[] = [];

  for (const field of REQUIRED_PROFILE_FIELDS) {
    const value = fields[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      problems.push(`${field} is missing or empty`);
    }
  }

  for (const [field, value] of Object.entries(fields)) {
    if (typeof value === "string" && PHONE_NUMBER.test(value)) {
      problems.push(`${field} looks like it contains a phone number`);
    }
  }

  return problems;
}
