// Content validation. Fails the build when the content source is missing
// something a visitor would notice. Issue 2 extends this with the full rule
// set from the PRD (earned credential without a date, work entry without
// outcomes, missing verification link, missing contact field).
//
// Runs as plain Node so CI doesn't need a TypeScript runner for it; the
// content file is read as text and the required fields are checked by name.

import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../content/profile.ts", import.meta.url), "utf8");

const required = ["name", "shortName", "location", "positioning", "supporting"];
const missing = required.filter((field) => !new RegExp(`^\\s*${field}:\\s*\\S`, "m").test(source));

if (missing.length > 0) {
  console.error(`check:content failed. Missing or empty fields in content/profile.ts: ${missing.join(", ")}`);
  process.exit(1);
}

if (/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(source)) {
  console.error("check:content failed. Something in content/profile.ts looks like a phone number, which the site must never carry.");
  process.exit(1);
}

console.log(`check:content ok (${required.length} required fields present, no phone number).`);
