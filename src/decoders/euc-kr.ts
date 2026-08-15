import { createMultiByteDecoder } from "./multi-byte-decoder";

/**
 * Node's native TextDecoder("euc-kr") has no mapping for single bytes 0x5C
 * and 0x80: LFS displays these as ₩ and € (KS X 1001 Won-sign convention
 * plus LFS's own Euro sign addition, matching every other codepage), but the
 * decoder returns a plain backslash for 0x5C and U+0080 unchanged for 0x80.
 * Override just those two bytes when they appear outside a 2-byte lead/trail
 * pair — neither byte falls within EUC-KR's valid trail-byte range
 * (0xA1-0xFE), so genuine Hangul sequences are unaffected.
 */
const eucKrSingleByteOverrides: Record<number, string> = {
  0x5c: "₩",
  0x80: "€",
};

const isEucKrLeadByte = (byte: number): boolean => byte > 0x80 && byte < 0xff;

export const decodeEucKr = createMultiByteDecoder(
  "euc-kr",
  isEucKrLeadByte,
  eucKrSingleByteOverrides,
);
