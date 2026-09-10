import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile content", () => {
  it("carries the name and both hero lines", () => {
    expect(profile.name).toBe("Alvaro Reis");
    expect(profile.positioning.length).toBeGreaterThan(0);
    expect(profile.supporting.length).toBeGreaterThan(0);
  });

  it("keeps the positioning line in first person and sentence case", () => {
    expect(profile.positioning).toMatch(/^[A-Z]/);
    expect(profile.positioning).toContain(" I ");
  });
});
