import { describe, it, expect } from "vitest";
import { safeRedirectPath } from "@/lib/safe-redirect";

describe("safeRedirectPath — open-redirect guard", () => {
  it("allows same-site rooted paths", () => {
    expect(safeRedirectPath("/dashboard/reading")).toBe("/dashboard/reading");
    expect(safeRedirectPath("/dashboard/results/abc?claim=abc")).toBe(
      "/dashboard/results/abc?claim=abc",
    );
  });

  it("falls back for absolute URLs", () => {
    expect(safeRedirectPath("https://evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("http://evil.com/path")).toBe("/dashboard");
  });

  it("falls back for protocol-relative and backslash tricks", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/dashboard");
    expect(safeRedirectPath("/\\evil.com")).toBe("/dashboard");
  });

  it("falls back for empty / missing input", () => {
    expect(safeRedirectPath(null)).toBe("/dashboard");
    expect(safeRedirectPath(undefined)).toBe("/dashboard");
    expect(safeRedirectPath("")).toBe("/dashboard");
  });

  it("honors a custom fallback", () => {
    expect(safeRedirectPath("https://evil.com", "/sign-in")).toBe("/sign-in");
  });
});
