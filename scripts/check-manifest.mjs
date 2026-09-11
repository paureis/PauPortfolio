// Scene manifest check. The 3D lane's export writes public/scene/manifest.json
// (see docs/SCENE-CONTRACT.md). Issue 3 makes this check fail when a contract
// name is missing. Until a manifest exists there is nothing to check, so this
// passes and says so; it must not fail the build for an absent file yet or
// the site could never ship before the scene lands.

import { access } from "node:fs/promises";

const manifestPath = new URL("../public/scene/manifest.json", import.meta.url);

try {
  await access(manifestPath);
} catch {
  console.log("check:manifest skipped. No public/scene/manifest.json yet; the scene lane adds it in Issue 3.");
  process.exit(0);
}

console.log("check:manifest ok. A manifest exists; Issue 3 adds the anchor and surface checks.");
