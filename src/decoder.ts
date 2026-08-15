import { decodeCP1252 } from "./decoders/cp1252";
import { decodeShiftJIS } from "./decoders/shift-jis";
import { decodeBig5 } from "./decoders/big5";
import { decodeEucKr } from "./decoders/euc-kr";

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
