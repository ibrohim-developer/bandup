import { describe, it, expect } from "vitest";
import { getOggOpusDurationSeconds, measureSpokenSeconds } from "@/lib/ogg-duration";

/**
 * Build a minimal synthetic OGG page header at `offset`: the "OggS" capture
 * pattern followed by version/type bytes, then the 64-bit LE granule position
 * at offset+6 — the only fields the parser reads.
 */
function writePage(buffer: Buffer, offset: number, granule: bigint) {
  buffer.write("OggS", offset, "ascii");
  buffer.writeUInt8(0, offset + 4); // stream_structure_version
  buffer.writeUInt8(0x04, offset + 5); // header_type (end of stream)
  buffer.writeBigUInt64LE(granule, offset + 6);
}

function makeOgg(pages: { at: number; granule: bigint }[], size: number): Buffer {
  const buffer = Buffer.alloc(size);
  for (const p of pages) writePage(buffer, p.at, p.granule);
  return buffer;
}

describe("getOggOpusDurationSeconds", () => {
  it("reads the last page's granule as 48kHz samples", () => {
    // 96000 samples at 48kHz = exactly 2 seconds.
    const buf = makeOgg([{ at: 0, granule: BigInt(96000) }], 64);
    expect(getOggOpusDurationSeconds(buf)).toBe(2);
  });

  it("uses the LAST page when several exist", () => {
    const buf = makeOgg(
      [
        { at: 0, granule: BigInt(48000) }, // 1s
        { at: 100, granule: BigInt(48000 * 5) }, // 5s — the final page wins
      ],
      160
    );
    expect(getOggOpusDurationSeconds(buf)).toBe(5);
  });

  it("skips a trailing -1 granule page in favor of an earlier real one", () => {
    const NONE = BigInt("0xFFFFFFFFFFFFFFFF");
    const buf = makeOgg(
      [
        { at: 0, granule: BigInt(48000 * 3) }, // 3s — the real length
        { at: 100, granule: NONE }, // completes no packet
      ],
      160
    );
    expect(getOggOpusDurationSeconds(buf)).toBe(3);
  });

  it("returns null for a buffer smaller than one page header", () => {
    expect(getOggOpusDurationSeconds(Buffer.alloc(26))).toBeNull();
  });

  it("returns null for non-OGG garbage", () => {
    const buf = Buffer.alloc(256, 0xab);
    expect(getOggOpusDurationSeconds(buf)).toBeNull();
  });
});

describe("measureSpokenSeconds", () => {
  it("prefers the exact container duration, rounded", () => {
    const buf = makeOgg([{ at: 0, granule: BigInt(48000 * 7 + 30000) }], 64); // 7.625s
    expect(measureSpokenSeconds(buf, 99)).toBe(8);
  });

  it("falls back to the model estimate when the container is unparseable", () => {
    const garbage = Buffer.alloc(64, 0x11);
    expect(measureSpokenSeconds(garbage, 12.4)).toBe(12);
  });

  it("charges the default fallback when both are unavailable", () => {
    const garbage = Buffer.alloc(64, 0x11);
    expect(measureSpokenSeconds(garbage, null)).toBe(10);
    expect(measureSpokenSeconds(garbage, NaN)).toBe(10);
    expect(measureSpokenSeconds(garbage, -5)).toBe(10);
  });

  it("honors a custom fallback", () => {
    const garbage = Buffer.alloc(64, 0x11);
    expect(measureSpokenSeconds(garbage, null, 3)).toBe(3);
  });
});
