/**
 * IELTS raw→band conversion for 40-question Listening/Reading tests.
 * Band thresholds follow the official IELTS Academic conversion table.
 */
export function rawToBand(raw: number): number {
  if (raw <= 0) return 0;
  if (raw >= 39) return 9;
  if (raw >= 37) return 8.5;
  if (raw >= 35) return 8;
  if (raw >= 33) return 7.5;
  if (raw >= 30) return 7;
  if (raw >= 27) return 6.5;
  if (raw >= 23) return 6;
  if (raw >= 20) return 5.5;
  if (raw >= 16) return 5;
  if (raw >= 13) return 4.5;
  if (raw >= 10) return 4;
  if (raw >= 6) return 3.5;
  if (raw >= 4) return 3;
  return 2.5;
}

/** Round to the nearest 0.5 band (IELTS averaging rule). */
export function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
}
