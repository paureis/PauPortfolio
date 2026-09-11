import { describe, expect, it } from "vitest";
import { profile, type Profile } from "./profile";
import { validateProfile } from "./validate";

function withField(overrides: Partial<Record<keyof Profile, unknown>>): unknown {
  return { ...profile, ...overrides };
}

describe("validateProfile", () => {
  it("accepts the real content", () => {
    expect(validateProfile(profile)).toEqual([]);
  });

  it("rejects an empty string", () => {
    expect(validateProfile(withField({ location: "" }))).toEqual(["location is missing or empty"]);
  });

  it("rejects whitespace-only copy", () => {
    expect(validateProfile(withField({ supporting: "   \n  " }))).toEqual([
      "supporting is missing or empty",
    ]);
  });

  it("rejects a missing field", () => {
    const { positioning: _dropped, ...rest } = profile;
    expect(validateProfile(rest)).toEqual(["positioning is missing or empty"]);
  });

  it("rejects a non-string value", () => {
    expect(validateProfile(withField({ name: 42 }))).toEqual(["name is missing or empty"]);
  });

  it("rejects something that is not an object", () => {
    expect(validateProfile(undefined)).toEqual(["profile is not an object"]);
  });

  it("rejects a phone number in any field", () => {
    expect(validateProfile(withField({ supporting: "Call me at 305-555-0142." }))).toEqual([
      "supporting looks like it contains a phone number",
    ]);
    expect(validateProfile(withField({ location: "Miramar 954.555.0199" }))).toEqual([
      "location looks like it contains a phone number",
    ]);
  });

  it("reports every problem, not just the first", () => {
    expect(validateProfile(withField({ name: "", shortName: " " }))).toEqual([
      "name is missing or empty",
      "shortName is missing or empty",
    ]);
  });
});
