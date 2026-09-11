import { describe, expect, it } from "vitest";
import { site } from "./site";
import { validateSite } from "./validate";

// The real content against the rules, plus the content rules from
// AGENTS.md that are about what the words say rather than their shape.

describe("site content", () => {
  it("passes validation", () => {
    expect(validateSite(site)).toEqual([]);
  });

  it("keeps the hero in first person and sentence case", () => {
    expect(site.profile.positioning).toMatch(/^[A-Z]/);
    expect(site.profile.positioning).toContain(" I ");
    expect(site.profile.tail).toMatch(/^[a-z]/);
  });

  it("leads with Talent Scout Pro, at resume level, separate from Forward Thinkers", () => {
    const [first] = site.work;
    expect(first.title).toBe("Talent Scout Pro");
    expect(first.visibility).toBe("resume");
    expect(first.links ?? []).toEqual([]);
    expect(first.summary).toContain("two healthcare organizations");

    const ids = site.work.map((entry) => entry.id);
    expect(ids).toContain("forward-thinkers-consulting");
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names two healthcare organizations and no other client", () => {
    const text = JSON.stringify(site.work);
    expect(text).toContain("two healthcare organizations");
    expect(text).not.toMatch(/\bhospital\b|\bhealth system\b/i);
  });

  it("keeps AZ-104 in progress with no date and no link", () => {
    const az104 = site.credentials.find((c) => c.id === "azure-administrator-associate");
    expect(az104?.status).toBe("in-progress");
    expect(az104?.earnedOn).toBeUndefined();
    expect(az104?.verificationUrl).toBeUndefined();
  });

  it("gives every other credential a date and a verification link", () => {
    for (const credential of site.credentials) {
      if (credential.status !== "earned") continue;
      expect(credential.earnedOn, credential.name).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(credential.verificationUrl, credential.name).toMatch(/^https:\/\//);
    }
  });

  it("puts the three headline credentials first", () => {
    expect(site.credentials.slice(0, 3).map((c) => c.tier)).toEqual(["headline", "headline", "headline"]);
  });

  it("carries the curated repositories only when Pau has chosen them", () => {
    for (const repo of site.howIWork.repositories) {
      expect(repo.href).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("has both languages and no phone number anywhere", () => {
    expect(site.offTheClock.languages.map((l) => l.name)).toEqual(["English", "Spanish"]);
    expect(JSON.stringify(site)).not.toMatch(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
  });
});
