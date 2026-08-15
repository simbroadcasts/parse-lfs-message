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

export const decodeCP1252 = (bytes: Uint8Array): string => {
  let result = "";

  for (const byte of bytes) {
    result += cp1252HighMap[byte] ?? String.fromCharCode(byte);
  }

  return result;
};
