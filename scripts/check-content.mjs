// Content validation gate. Imports the real content module and validates the
// exported values, so a missing, empty, or whitespace-only field fails the
// build no matter how the source file is formatted. Runs under Node's type
// stripping (see the check:content script in package.json), which is why
// the imports carry .ts extensions.

import { profile } from "../content/profile.ts";
import { REQUIRED_PROFILE_FIELDS, validateProfile } from "../content/validate.ts";

const problems = validateProfile(profile);

if (problems.length > 0) {
  console.error("check:content failed:");
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

console.log(
  `check:content ok (${REQUIRED_PROFILE_FIELDS.length} required fields present, no phone number).`,
);
