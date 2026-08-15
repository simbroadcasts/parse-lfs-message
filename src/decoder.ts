export const codepages = {
  /** Default codepage */
  "8": "CP1252",

  /** Latin 1 */
  L: "CP1252",

  /** Greek */
  G: "CP1253",

  /** Cyrillic */
  C: "CP1251",

  /** Central Europe */
  E: "CP1250",

  /** Turkish */
  T: "CP1254",

  /** Baltic */
  B: "CP1257",

  /** Japanese */
  J: "shift-jis",

  /** Traditional Chinese */
  H: "big5",

  /** Simplified Chinese */
  S: "gbk",

  /** Korean */
  K: "euc-kr",
} as const;

export type Codepage = keyof typeof codepages;

export interface Decoder {
  decode(bytes: Uint8Array): string;
}

/**
 * Node's native TextDecoder("windows-1252") is broken on Node >= 20: bytes
 * 0x80-0x9F pass through unchanged instead of mapping to the correct
 * characters (€, curly quotes, etc). Decode that block ourselves instead of
 * relying on the platform.
 */
const cp1252HighMap: Record<number, string> = {
  0x80: "€",
  0x82: "‚",
  0x83: "ƒ",
  0x84: "„",
  0x85: "…",
  0x86: "†",
  0x87: "‡",
  0x88: "ˆ",
  0x89: "‰",
  0x8a: "Š",
  0x8b: "‹",
  0x8c: "Œ",
  0x8e: "Ž",
  0x91: "‘",
  0x92: "’",
  0x93: "“",
  0x94: "”",
  0x95: "•",
  0x96: "–",
  0x97: "—",
  0x98: "˜",
  0x99: "™",
  0x9a: "š",
  0x9b: "›",
  0x9c: "œ",
  0x9e: "ž",
  0x9f: "Ÿ",
};

const decodeCP1252 = (bytes: Uint8Array): string => {
  let result = "";

  for (const byte of bytes) {
    result += cp1252HighMap[byte] ?? String.fromCharCode(byte);
  }

  return result;
};

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

const decodeShiftJIS = (bytes: Uint8Array): string => {
  const textDecoder = new TextDecoder("shift-jis");
  let result = "";

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];

    if (isShiftJISLeadByte(byte) && i + 1 < bytes.length) {
      result += textDecoder.decode(bytes.slice(i, i + 2));
      i++;
    } else {
      result +=
        shiftJISSingleByteOverrides[byte] ??
        textDecoder.decode(bytes.slice(i, i + 1));
    }
  }

  return result;
};

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

const decodeBig5 = (bytes: Uint8Array): string => {
  const textDecoder = new TextDecoder("big5");
  let result = "";

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];

    if (isBig5LeadByte(byte) && i + 1 < bytes.length) {
      result += textDecoder.decode(bytes.slice(i, i + 2));
      i++;
    } else {
      result +=
        big5SingleByteOverrides[byte] ?? textDecoder.decode(bytes.slice(i, i + 1));
    }
  }

  return result;
};

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

const decodeEucKr = (bytes: Uint8Array): string => {
  const textDecoder = new TextDecoder("euc-kr");
  let result = "";

  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];

    if (isEucKrLeadByte(byte) && i + 1 < bytes.length) {
      result += textDecoder.decode(bytes.slice(i, i + 2));
      i++;
    } else {
      result +=
        eucKrSingleByteOverrides[byte] ?? textDecoder.decode(bytes.slice(i, i + 1));
    }
  }

  return result;
};

export const createDecoder = (codepage: Codepage): Decoder => {
  const encoding = codepages[codepage];

  if (encoding === "CP1252") {
    return { decode: decodeCP1252 };
  }

  if (encoding === "shift-jis") {
    return { decode: decodeShiftJIS };
  }

  if (encoding === "big5") {
    return { decode: decodeBig5 };
  }

  if (encoding === "euc-kr") {
    return { decode: decodeEucKr };
  }

  return new TextDecoder(encoding);
};
