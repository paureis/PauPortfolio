import { describe, expect, it } from "vitest";
import type { SiteContent } from "./types";
import { validateSite } from "./validate";

// A small but complete site that passes every rule. Each test below breaks
// exactly one thing and expects exactly that problem reported.
function validSite(): SiteContent {
  return {
    profile: {
      name: "Alvaro Reis",
      shortName: "Pau",
      location: "Miramar, Florida",
      positioning: "AI engineer. I build agentic systems that ship to production",
      tail: "usually from this desk",
      supporting: "Sole engineer on a multi-tenant recruiting platform.",
    },
    stations: [
      { id: "wide", title: "Alvaro Reis", anchor: "top" },
      { id: "main-monitor", title: "Selected work", anchor: "work" },
      { id: "side-monitor", title: "How I work", anchor: "how-i-work" },
      { id: "wall", title: "Credentials", anchor: "credentials" },
      { id: "desk-end", title: "Off the clock", anchor: "off-the-clock" },
      { id: "window", title: "Contact", anchor: "contact" },
    ],
    work: [
      {
        id: "talent-scout-pro",
        title: "Talent Scout Pro",
        role: "Sole engineer",
        start: "2025-01",
        summary: "A recruiting platform.",
        outcomes: ["Sourcing time from 12 hours to under 8 minutes."],
        decisions: ["Event-driven pipeline."],
        visibility: "resume",
      },
      {
        id: "cyberse",
        title: "Cyberse",
        role: "Founder",
        start: "2024-01",
        summary: "A web studio.",
        outcomes: ["Sites for clients."],
        decisions: [],
        links: [{ label: "cyberse.us", href: "https://cyberse.us" }],
        visibility: "public",
      },
    ],
    timeline: [{ organization: "NEO Consulting Group", role: "Intern", start: "2024-05", end: "2024-08" }],
    howIWork: {
      intro: "I work with agents.",
      lifecycle: [
        { name: "Plan", description: "Agree on the change." },
        { name: "Implement", description: "Build it." },
      ],
      practice: ["Twenty-plus reusable skills."],
      repositories: [{ name: "PauPortfolio", href: "https://github.com/paureis/PauPortfolio", description: "This site." }],
    },
    credentials: [
      {
        id: "aws-saa",
        name: "AWS Certified Solutions Architect, Associate",
        issuer: "Amazon Web Services",
        tier: "headline",
        status: "earned",
        earnedOn: "2025-03-01",
        verificationUrl: "https://www.credly.com/badges/example",
      },
      {
        id: "az-104",
        name: "Azure Administrator Associate",
        issuer: "Microsoft",
        tier: "fundamentals",
        status: "in-progress",
      },
    ],
    education: [{ school: "University of Central Florida", degree: "B.S. Information Technology", when: "2025" }],
    offTheClock: {
      intro: "When the pipeline is not running.",
      items: [{ title: "Counter-Strike", detail: "Faceit level 10." }],
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Spanish", level: "Fluent" },
      ],
    },
    contact: {
      intro: "Email is best.",
      email: "pau@example.com",
      linkedin: "https://www.linkedin.com/in/example",
      github: "https://github.com/paureis",
      resume: "/Alvaro-Reis-resume.pdf",
      closing: "That is the whole desk.",
    },
  };
}

// Deep-clone and let the test mutate any part without typing constraints.
function broken(mutate: (site: any) => void): unknown {
  const site = JSON.parse(JSON.stringify(validSite()));
  mutate(site);
  return site;
}

describe("validateSite", () => {
  it("accepts a valid site", () => {
    expect(validateSite(validSite())).toEqual([]);
  });

  it("rejects something that is not an object", () => {
    expect(validateSite(undefined)).toEqual(["site is not an object"]);
    expect(validateSite("nope")).toEqual(["site is not an object"]);
  });

  describe("profile", () => {
    it("rejects an empty, whitespace, missing, or non-string field", () => {
      expect(validateSite(broken((s) => (s.profile.location = "")))).toEqual([
        "profile.location is missing or empty",
      ]);
      expect(validateSite(broken((s) => (s.profile.supporting = " \n ")))).toEqual([
        "profile.supporting is missing or empty",
      ]);
      expect(validateSite(broken((s) => delete s.profile.tail))).toEqual([
        "profile.tail is missing or empty",
      ]);
      expect(validateSite(broken((s) => (s.profile.name = 42)))).toEqual([
        "profile.name is missing or empty",
      ]);
    });
  });

  describe("phone numbers", () => {
    it("rejects a phone number anywhere in the content, however deep", () => {
      expect(validateSite(broken((s) => (s.profile.supporting = "Call 305-555-0142.")))).toEqual([
        "profile.supporting looks like it contains a phone number",
      ]);
      expect(
        validateSite(broken((s) => (s.work[0].outcomes[0] = "Reach me at 954.555.0199"))),
      ).toEqual(["work[0].outcomes[0] looks like it contains a phone number"]);
      expect(validateSite(broken((s) => (s.contact.closing = "(305) 555 0100")))).toEqual([
        "contact.closing looks like it contains a phone number",
      ]);
    });

    it("does not mistake a year-month or a dotted version for a phone number", () => {
      expect(validateSite(broken((s) => (s.work[0].summary = "Latency 800 to 450 ms in 2025-03")))).toEqual(
        [],
      );
    });
  });

  describe("work", () => {
    it("requires at least one entry", () => {
      expect(validateSite(broken((s) => (s.work = [])))).toEqual(["work has no entries"]);
    });

    it("rejects an entry without outcomes", () => {
      expect(validateSite(broken((s) => (s.work[0].outcomes = [])))).toEqual([
        "work[0] (Talent Scout Pro) has no outcomes",
      ]);
      expect(validateSite(broken((s) => delete s.work[0].outcomes))).toEqual([
        "work[0] (Talent Scout Pro) has no outcomes",
      ]);
      expect(validateSite(broken((s) => (s.work[0].outcomes = ["", "ok"])))).toEqual([
        "work[0].outcomes[0] is missing or empty",
      ]);
    });

    it("rejects missing required text", () => {
      expect(validateSite(broken((s) => (s.work[1].summary = "")))).toEqual([
        "work[1].summary is missing or empty",
      ]);
      expect(validateSite(broken((s) => delete s.work[1].role))).toEqual([
        "work[1].role is missing or empty",
      ]);
    });

    it("rejects a start date that is not year-month, but allows no date at all", () => {
      expect(validateSite(broken((s) => (s.work[0].start = "January 2025")))).toEqual([
        "work[0].start must be YYYY-MM",
      ]);
      expect(validateSite(broken((s) => delete s.work[0].start))).toEqual([]);
    });

    it("rejects an unknown visibility and links on a resume-level entry", () => {
      expect(validateSite(broken((s) => (s.work[0].visibility = "secret")))).toEqual([
        "work[0].visibility must be resume or public",
      ]);
      expect(
        validateSite(broken((s) => (s.work[0].links = [{ label: "site", href: "https://example.com" }]))),
      ).toEqual(["work[0] (Talent Scout Pro) is resume-level and may not link out"]);
    });

    it("rejects duplicate ids", () => {
      expect(validateSite(broken((s) => (s.work[1].id = "talent-scout-pro")))).toEqual([
        "work[1].id duplicates talent-scout-pro",
      ]);
    });

    it("rejects a link without an https href", () => {
      expect(validateSite(broken((s) => (s.work[1].links[0].href = "cyberse.us")))).toEqual([
        "work[1].links[0].href must be an https URL",
      ]);
    });
  });

  describe("credentials", () => {
    it("rejects an earned credential without a date", () => {
      expect(validateSite(broken((s) => delete s.credentials[0].earnedOn))).toEqual([
        "credentials[0] (AWS Certified Solutions Architect, Associate) is earned but has no earnedOn date",
      ]);
    });

    it("rejects an in-progress credential with a date", () => {
      expect(validateSite(broken((s) => (s.credentials[1].earnedOn = "2026-09-14")))).toEqual([
        "credentials[1] (Azure Administrator Associate) is in progress but has an earnedOn date",
      ]);
    });

    it("rejects an earned credential without a verification link", () => {
      expect(validateSite(broken((s) => delete s.credentials[0].verificationUrl))).toEqual([
        "credentials[0] (AWS Certified Solutions Architect, Associate) is earned but has no verificationUrl",
      ]);
      expect(validateSite(broken((s) => (s.credentials[0].verificationUrl = "credly.com/x")))).toEqual([
        "credentials[0].verificationUrl must be an https URL",
      ]);
    });

    it("rejects a malformed date and an expiry before the earned date", () => {
      expect(validateSite(broken((s) => (s.credentials[0].earnedOn = "March 2025")))).toEqual([
        "credentials[0].earnedOn must be YYYY-MM-DD",
      ]);
      expect(validateSite(broken((s) => (s.credentials[0].expiresOn = "2024-01-01")))).toEqual([
        "credentials[0].expiresOn is before earnedOn",
      ]);
    });

    it("rejects an unknown status or tier", () => {
      expect(validateSite(broken((s) => (s.credentials[1].status = "planned")))).toEqual([
        "credentials[1].status must be earned or in-progress",
      ]);
      expect(validateSite(broken((s) => (s.credentials[0].tier = "gold")))).toEqual([
        "credentials[0].tier must be headline, supporting, or fundamentals",
      ]);
    });

    it("requires at least one credential and unique ids", () => {
      expect(validateSite(broken((s) => (s.credentials = [])))).toEqual(["credentials has no entries"]);
      expect(validateSite(broken((s) => (s.credentials[1].id = "aws-saa")))).toEqual([
        "credentials[1].id duplicates aws-saa",
      ]);
    });
  });

  describe("contact", () => {
    it("rejects a missing contact field", () => {
      expect(validateSite(broken((s) => delete s.contact.email))).toEqual([
        "contact.email is missing or empty",
      ]);
      expect(validateSite(broken((s) => (s.contact.resume = "")))).toEqual([
        "contact.resume is missing or empty",
      ]);
      expect(validateSite(broken((s) => delete s.contact))).toEqual(["contact is missing"]);
    });

    it("rejects a malformed email, link, or resume path", () => {
      expect(validateSite(broken((s) => (s.contact.email = "pau at example")))).toEqual([
        "contact.email is not an email address",
      ]);
      expect(validateSite(broken((s) => (s.contact.linkedin = "linkedin.com/in/x")))).toEqual([
        "contact.linkedin must be an https URL",
      ]);
      expect(validateSite(broken((s) => (s.contact.resume = "resume.pdf")))).toEqual([
        "contact.resume must be a root-relative path to a .pdf",
      ]);
    });
  });

  describe("how I work, stations, timeline, education, off the clock", () => {
    it("requires the lifecycle and checks repositories", () => {
      expect(validateSite(broken((s) => (s.howIWork.lifecycle = [])))).toEqual([
        "howIWork.lifecycle has no entries",
      ]);
      expect(validateSite(broken((s) => (s.howIWork.lifecycle[1].description = "")))).toEqual([
        "howIWork.lifecycle[1].description is missing or empty",
      ]);
      expect(validateSite(broken((s) => (s.howIWork.repositories[0].href = "github.com/x")))).toEqual([
        "howIWork.repositories[0].href must be an https URL",
      ]);
      expect(validateSite(broken((s) => (s.howIWork.repositories = [])))).toEqual([]);
    });

    it("requires all six stations in story order with unique anchors", () => {
      expect(validateSite(broken((s) => s.stations.splice(3, 1)))).toEqual([
        "stations must be wide, main-monitor, side-monitor, wall, desk-end, window in that order",
      ]);
      expect(validateSite(broken((s) => (s.stations[1].anchor = "top")))).toEqual([
        "stations[1].anchor duplicates top",
      ]);
    });

    it("checks the timeline, education, and off-the-clock fields", () => {
      expect(validateSite(broken((s) => (s.timeline[0].start = "2024")))).toEqual([
        "timeline[0].start must be YYYY-MM",
      ]);
      expect(validateSite(broken((s) => (s.timeline = [])))).toEqual(["timeline has no entries"]);
      expect(validateSite(broken((s) => (s.education[0].when = "")))).toEqual([
        "education[0].when is missing or empty",
      ]);
      expect(validateSite(broken((s) => (s.offTheClock.items = [])))).toEqual([
        "offTheClock.items has no entries",
      ]);
      expect(validateSite(broken((s) => (s.offTheClock.languages[1].level = "")))).toEqual([
        "offTheClock.languages[1].level is missing or empty",
      ]);
    });
  });

  it("reports every problem, not just the first", () => {
    const problems = validateSite(
      broken((s) => {
        s.profile.name = "";
        s.work[0].outcomes = [];
        delete s.credentials[0].earnedOn;
        delete s.contact.email;
      }),
    );
    expect(problems).toEqual([
      "profile.name is missing or empty",
      "work[0] (Talent Scout Pro) has no outcomes",
      "credentials[0] (AWS Certified Solutions Architect, Associate) is earned but has no earnedOn date",
      "contact.email is missing or empty",
    ]);
  });
});
