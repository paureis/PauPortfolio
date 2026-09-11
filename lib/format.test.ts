import { describe, expect, it } from "vitest";
import { formatDate, formatMonth, formatSpan } from "./format";

describe("date formatting", () => {
  it("writes a year-month in English", () => {
    expect(formatMonth("2026-02")).toBe("February 2026");
    expect(formatMonth("2021-12")).toBe("December 2021");
  });

  it("writes a full date without a leading zero on the day", () => {
    expect(formatDate("2026-02-17")).toBe("February 17, 2026");
    expect(formatDate("2024-08-05")).toBe("August 5, 2024");
  });

  it("writes a span, open-ended when there is no end", () => {
    expect(formatSpan("2025-06", "2025-08")).toBe("June 2025 to August 2025");
    expect(formatSpan("2026-02")).toBe("February 2026 to now");
  });
});
