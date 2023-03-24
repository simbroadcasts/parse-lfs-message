import parseLFSMessage from "../index";
import { asciiCharacterMap } from "./helpers";

const characters = {
  ...asciiCharacterMap,
  // 127 [DEL] not available in LFS
  128: "€",
  // 129 unused
  // 130 [‚] not available in LFS
  // 131 [ƒ] not available in LFS
  // 132 [„] not available in LFS
  133: "…",
  134: "†",
  135: "‡",
  136: "ˆ",
  137: "‰",
  138: "Š",
  139: "‹",
  140: "Œ",
  // 141 unused
  142: "Ž",
  // 143 unused
  // 144 unused
  145: "‘",
  146: "’",
  147: "“",
  148: "”",
  149: "•",
  150: "–",
  151: "—",
  152: "˜",
  153: "™",
  154: "š",
  155: "›",
  156: "œ",
  // 157 unused
  158: "ž",
  159: "Ÿ",
  160: " ",
  161: "¡",
  162: "¢",
  163: "£",
  // 164 [¤] not available in LFS
  165: "¥",
  166: "¦",
  167: "§",
  168: "¨",
  169: "©",
  170: "ª",
  171: "«",
  172: "¬",
  173: "­",
  174: "®",
  175: "¯",
  176: "°",
  177: "±",
  178: "²",
  179: "³",
  180: "´",
  181: "µ",
  182: "¶",
  183: "·",
  184: "¸",
  185: "¹",
  186: "º",
  187: "»",
  // 188 [¼] not available in LFS
  // 189 [½] not available in LFS
  // 190 [¾] not available in LFS
  191: "¿",
  192: "À",
  193: "Á",
  194: "Â",
  195: "Ã",
  196: "Ä",
  197: "Å",
  198: "Æ",
  199: "Ç",
  200: "È",
  201: "É",
  202: "Ê",
  203: "Ë",
  204: "Ì",
  205: "Í",
  206: "Î",
  207: "Ï",
  208: "Ð",
  209: "Ñ",
  210: "Ò",
  211: "Ó",
  212: "Ô",
  213: "Õ",
  214: "Ö",
  215: "×",
  216: "Ø",
  217: "Ù",
  218: "Ú",
  219: "Û",
  220: "Ü",
  221: "Ý",
  222: "Þ",
  223: "ß",
  224: "à",
  225: "á",
  226: "â",
  227: "ã",
  228: "ä",
  229: "å",
  230: "æ",
  231: "ç",
  232: "è",
  233: "é",
  234: "ê",
  235: "ë",
  236: "ì",
  237: "í",
  238: "î",
  239: "ï",
  240: "ð",
  241: "ñ",
  242: "ò",
  243: "ó",
  244: "ô",
  245: "õ",
  246: "ö",
  247: "÷",
  248: "ø",
  249: "ù",
  250: "ú",
  251: "û",
  252: "ü",
  253: "ý",
  254: "þ",
  255: "ÿ",
};

describe("CP1250", () => {
  it("should convert Latin 1 (CP1252) as the default codepage", () => {
    expect(
      parseLFSMessage(
        new Uint8Array(Object.keys(characters).map((key) => Number(key)))
      )
    ).toEqual(Array.from(Object.values(characters)).join(""));
  });

  it("should convert Latin 1 (CP1252) using ^L control character", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          76, // L
          ...Object.keys(characters).map((key) => Number(key)),
        ])
      )
    ).toEqual(Object.values(characters).join(""));
  });
});
