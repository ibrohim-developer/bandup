import { describe, it, expect } from "vitest";
import {
  addGuestAttempt,
  decodeGuestAttempts,
  canClaimAttempt,
} from "@/lib/guest-claim";

describe("guest-claim — signed cookie binding", () => {
  it("lets the creator claim their own attempt", () => {
    const cookie = addGuestAttempt(undefined, "attempt-a");
    expect(canClaimAttempt(cookie, "attempt-a")).toBe(true);
  });

  it("accumulates multiple attempts and dedupes", () => {
    let c = addGuestAttempt(undefined, "a");
    c = addGuestAttempt(c, "b");
    c = addGuestAttempt(c, "a");
    expect(decodeGuestAttempts(c).sort()).toEqual(["a", "b"]);
    expect(canClaimAttempt(c, "a")).toBe(true);
    expect(canClaimAttempt(c, "b")).toBe(true);
  });

  it("cannot claim an attempt not in the cookie", () => {
    const cookie = addGuestAttempt(undefined, "mine");
    expect(canClaimAttempt(cookie, "victim")).toBe(false);
  });

  it("rejects a forged cookie with no valid signature", () => {
    const payload = Buffer.from(JSON.stringify(["victim"]), "utf8").toString("base64url");
    const forged = `${payload}.${Buffer.from("garbage").toString("base64url")}`;
    expect(canClaimAttempt(forged, "victim")).toBe(false);
  });

  it("rejects a tampered payload re-using a real signature", () => {
    const real = addGuestAttempt(undefined, "mine");
    const sig = real.split(".")[1];
    const swapped =
      Buffer.from(JSON.stringify(["victim"]), "utf8").toString("base64url") + "." + sig;
    expect(canClaimAttempt(swapped, "victim")).toBe(false);
  });

  it("rejects empty / garbage cookies", () => {
    expect(canClaimAttempt("", "a")).toBe(false);
    expect(canClaimAttempt("not-a-cookie", "a")).toBe(false);
    expect(canClaimAttempt(undefined, "a")).toBe(false);
  });
});
