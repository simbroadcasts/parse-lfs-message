import { createMultiByteDecoder } from "./multi-byte-decoder";

/**
 * Node's native TextDecoder("shift-jis") has no mapping for single bytes
 * 0x5C and 0x80: LFS displays these as ¥ and € (JIS X 0201 Roman convention
 * plus LFS's own Euro sign addition, matching every other codepage), but the
 * decoder returns a plain backslash for 0x5C and U+FFFD for 0x80. Override
 * just those two bytes when they appear outside a 2-byte lead/trail pair, so
 * genuine Kanji sequences that happen to contain those byte values as their
 * trail byte are left untouched.
 */
const shiftJISSingleByteOverrides: Record<number, string> = {
  0x5c: "¥",
  0x80: "€",
};

const isShiftJISLeadByte = (byte: number): boolean =>
  (byte > 0x80 && byte < 0xa0) || (byte >= 0xe0 && byte < 0xfd);

export const decodeShiftJIS = createMultiByteDecoder(
  "shift-jis",
  isShiftJISLeadByte,
  shiftJISSingleByteOverrides,
);
