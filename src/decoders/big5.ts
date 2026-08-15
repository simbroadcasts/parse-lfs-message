import { createMultiByteDecoder } from "./multi-byte-decoder";

/**
 * Node's native TextDecoder("big5") has no mapping for single byte 0x80:
 * LFS displays it as € (matching every other codepage), but the decoder
 * returns U+0080 unchanged. Override just that byte when it appears outside
 * a 2-byte lead/trail pair — 0x80 never appears as a legitimate Big5 trail
 * byte, so genuine 2-byte Traditional Chinese characters are unaffected.
 */
const big5SingleByteOverrides: Record<number, string> = {
  0x80: "€",
};

const isBig5LeadByte = (byte: number): boolean => byte > 0x80 && byte < 0xff;

export const decodeBig5 = createMultiByteDecoder(
  "big5",
  isBig5LeadByte,
  big5SingleByteOverrides,
);
