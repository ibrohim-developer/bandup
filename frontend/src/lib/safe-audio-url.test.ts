import { describe, it, expect } from "vitest";
import { resolveSafeAudioUrl } from "@/lib/safe-audio-url";

// No NEXT_PUBLIC_STRAPI_URL set in tests, so it falls back to http://localhost:1337.
describe("resolveSafeAudioUrl — SSRF guard", () => {
  it("accepts a relative /uploads path", () => {
    expect(resolveSafeAudioUrl("/uploads/rec.webm")).toBe(
      "http://localhost:1337/uploads/rec.webm",
    );
  });

  it("accepts a same-origin /uploads absolute URL", () => {
    expect(resolveSafeAudioUrl("http://localhost:1337/uploads/x.webm")).toBe(
      "http://localhost:1337/uploads/x.webm",
    );
  });

  it("rejects cloud-metadata and arbitrary hosts", () => {
    expect(resolveSafeAudioUrl("http://169.254.169.254/latest/meta-data/")).toBeNull();
    expect(resolveSafeAudioUrl("http://evil.com/x")).toBeNull();
    expect(resolveSafeAudioUrl("https://api.bandup.uz.evil.com/uploads/x")).toBeNull();
  });

  it("rejects protocol-relative and path-traversal", () => {
    expect(resolveSafeAudioUrl("//evil.com/x")).toBeNull();
    expect(resolveSafeAudioUrl("/uploads/../secret")).toBeNull();
  });

  it("rejects non-http schemes and empty input", () => {
    expect(resolveSafeAudioUrl("file:///etc/passwd")).toBeNull();
    expect(resolveSafeAudioUrl("")).toBeNull();
    expect(resolveSafeAudioUrl(null)).toBeNull();
  });
});
