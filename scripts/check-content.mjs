// Content validation gate. Imports the real content module and validates the
// exported value, so invalid content fails the build no matter how the
// source file is formatted. Runs under Node's type stripping (see the
// check:content script in package.json), which is why the imports carry
// .ts extensions.
//
// Two checks live here rather than in content/validate.ts because they
// touch the file system: the resume PDF the contact section links to must
// exist under public/, and it must be a PDF. The path is resolved and
// checked against the public directory before it is read, so a value that
// slipped past validation still cannot make the gate read a file the site
// would not serve.

import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";
import { site } from "../content/site.ts";
import { isPublicPdfPath, validateSite } from "../content/validate.ts";

const problems = validateSite(site);

const publicDir = resolve(fileURLToPath(new URL("../public", import.meta.url)));
const resume = site?.contact?.resume;

if (typeof resume === "string" && isPublicPdfPath(resume)) {
  const resumePath = resolve(publicDir, `.${resume}`);
  if (!resumePath.startsWith(publicDir + sep)) {
    problems.push(`contact.resume (${resume}) resolves outside public/`);
  } else {
    try {
      await access(resumePath);
      const head = (await readFile(resumePath)).subarray(0, 5).toString("latin1");
      if (head !== "%PDF-") {
        problems.push(`contact.resume (public${resume}) is not a PDF`);
      }
    } catch {
      problems.push(`contact.resume points at public${resume}, which does not exist`);
    }
  }
}

if (problems.length > 0) {
  console.error("check:content failed:");
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  process.exit(1);
}

const counts = [
  `${site.work.length} work entries`,
  `${site.credentials.length} credentials`,
  `${site.timeline.length} timeline entries`,
];
console.log(`check:content ok (${counts.join(", ")}, resume present, no phone number).`);
