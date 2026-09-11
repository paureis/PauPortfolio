import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import HomePage from "./page";

// The document fallback, rendered to plain HTML with no client code and no
// canvas. Every content item must be present, in story order, as text.

function decode(html: string): string {
  return html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

const html = decode(renderToStaticMarkup(<HomePage />));

// The reading order the PRD's story arc prescribes, built from the model
// rather than from the components so the test is independent of how the
// page happens to be assembled.
function expectedOrder(): string[] {
  const [wide, work, howIWork, wall, deskEnd, window_] = site.stations;
  const items: string[] = [];

  items.push(site.profile.name, site.profile.positioning, site.profile.tail, site.profile.supporting);

  items.push(work.title);
  for (const entry of site.work) {
    items.push(entry.title, entry.role, entry.summary, ...entry.outcomes, ...entry.decisions);
    for (const link of entry.links ?? []) items.push(link.label);
  }
  for (const entry of site.timeline) items.push(entry.organization, entry.role);

  items.push(howIWork.title, site.howIWork.intro);
  for (const phase of site.howIWork.lifecycle) items.push(phase.name, phase.description);
  items.push(...site.howIWork.practice, site.howIWork.source.label);
  for (const repo of site.howIWork.repositories) items.push(repo.name, repo.description);

  items.push(wall.title);
  for (const credential of site.credentials) {
    items.push(credential.name, credential.issuer);
    if (credential.status === "earned" && credential.earnedOn) {
      items.push(formatDate(credential.earnedOn));
    }
  }
  for (const entry of site.education) items.push(entry.degree, entry.school, entry.when);

  items.push(deskEnd.title, site.offTheClock.intro);
  for (const item of site.offTheClock.items) items.push(item.title, item.detail);
  for (const language of site.offTheClock.languages) items.push(language.name);

  items.push(window_.title, site.contact.intro, site.contact.email, site.contact.closing);
  return items;
}

describe("the document page", () => {
  it("renders every content item as text, in story order", () => {
    let cursor = 0;
    for (const item of expectedOrder()) {
      const at = html.indexOf(item, cursor);
      expect(at, `"${item}" should appear after position ${cursor}`).toBeGreaterThanOrEqual(0);
      cursor = at;
    }
  });

  it("carries the six stations as sections with headings, in order", () => {
    const anchors = site.stations.slice(1).map((s) => s.anchor);
    const positions = anchors.map((anchor) => html.indexOf(`id="${anchor}"`));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html.match(/<h2 /g)?.length).toBe(anchors.length);
    expect(html.match(/<h1 /g)?.length).toBe(1);
  });

  it("links the resume, the email, LinkedIn, GitHub, and every verification page", () => {
    expect(html).toContain(`href="${site.contact.resume}" download`);
    expect(html).toContain(`href="mailto:${site.contact.email}"`);
    expect(html).toContain(`href="${site.contact.linkedin}"`);
    expect(html).toContain(`href="${site.contact.github}"`);
    for (const credential of site.credentials) {
      if (credential.verificationUrl) expect(html).toContain(`href="${credential.verificationUrl}"`);
    }
  });

  it("shows AZ-104 as in progress and marks Talent Scout Pro first", () => {
    expect(html).toContain("In progress");
    const firstEntry = html.indexOf('class="entry"');
    expect(html.indexOf("Talent Scout Pro")).toBeGreaterThan(firstEntry);
    expect(html.indexOf("Talent Scout Pro")).toBeLessThan(html.indexOf("Forward Thinkers Consulting"));
  });

  it("has no canvas, no script, and no phone number", () => {
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<script");
    expect(html).not.toMatch(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
  });
});
