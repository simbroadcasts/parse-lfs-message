import parseLFSMessage from "../index";
import { asciiCharacterMap } from "./helpers";

const characters = {
  ...asciiCharacterMap,
  // 127 [DEL] not available in LFS
  128: "€",
  // 129 unused
  // 130 [‚] not available in LFS
  // 131 unused
  // 132 [„] not available in LFS
  133: "…",
  134: "†",
  135: "‡",
  // 136 unused
  // 137 [‰] not available in LFS
  // 138 unused
  139: "‹",
  // 140 unused
  141: "¨",
  142: "ˇ",
  // 143 [¸] not available in LFS
  // 144 unused
  145: "‘",
  146: "’",
  147: "“",
  148: "”",
  149: "•",
  150: "–",
  151: "—",
  // 152 unused
  153: "™",
  // 154 unused
  155: "›",
  // 156 unused
  157: "¯",
  158: "˛",
  // 159 unused
  160: " ",
  // 161 unused
  162: "¢",
  163: "£",
  // 164 [¤] not available in LFS
  // 165 unused
  166: "¦",
  167: "§",
  168: "Ø",
  169: "©",
  170: "Ŗ",
  171: "«",
  172: "¬",
  173: "­",
  174: "®",
  175: "Æ",
  176: "°",
  177: "±",
  178: "²",
  179: "³",
  180: "´",
  181: "µ",
  182: "¶",
  183: "·",
  184: "ø",
  185: "¹",
  186: "ŗ",
  187: "»",
  // 188 [¼] not available in LFS
  // 189 [½] not available in LFS
  // 190 [¾] not available in LFS
  191: "æ",
  192: "Ą",
  193: "Į",
  194: "Ā",
  195: "Ć",
  196: "Ä",
  197: "Å",
  198: "Ę",
  199: "Ē",
  200: "Č",
  201: "É",
  202: "Ź",
  203: "Ė",
  204: "Ģ",
  205: "Ķ",
  206: "Ī",
  207: "Ļ",
  208: "Š",
  209: "Ń",
  210: "Ņ",
  211: "Ó",
  212: "Ō",
  213: "Õ",
  214: "Ö",
  215: "×",
  216: "Ų",
  217: "Ł",
  218: "Ś",
  219: "Ū",
  220: "Ü",
  221: "Ż",
  222: "Ž",
  223: "ß",
  224: "ą",
  225: "į",
  226: "ā",
  227: "ć",
  228: "ä",
  229: "å",
  230: "ę",
  231: "ē",
  232: "č",
  233: "é",
  234: "ź",
  235: "ė",
  236: "ģ",
  237: "ķ",
  238: "ī",
  239: "ļ",
  240: "š",
  241: "ń",
  242: "ņ",
  243: "ó",
  244: "ō",
  245: "õ",
  246: "ö",
  247: "÷",
  248: "ų",
  249: "ł",
  250: "ś",
  251: "ū",
  252: "ü",
  253: "ż",
  254: "ž",
  255: "˙",
};

describe("CP1257", () => {
  it("should convert Baltic (CP1257) using ^B control character", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          66, // B
          ...Object.keys(characters).map((key) => Number(key)),
        ]),
      ),
    ).toEqual(Object.values(characters).join(""));
  });
});
