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
  137: "‰",
  138: "Š",
  139: "‹",
  140: "Ś",
  141: "Ť",
  142: "Ž",
  143: "Ź",
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
  154: "š",
  155: "›",
  156: "ś",
  157: "ť",
  158: "ž",
  159: "ź",
  160: " ",
  161: "ˇ",
  162: "˘",
  163: "Ł",
  // 164 [¤] not available in LFS
  165: "Ą",
  166: "¦",
  167: "§",
  168: "¨",
  169: "©",
  170: "Ş",
  171: "«",
  172: "¬",
  173: "­",
  174: "®",
  175: "Ż",
  176: "°",
  177: "±",
  178: "˛",
  179: "ł",
  180: "´",
  181: "µ",
  182: "¶",
  183: "·",
  184: "¸",
  185: "ą",
  186: "ş",
  187: "»",
  188: "Ľ",
  189: "˝",
  190: "ľ",
  191: "ż",
  192: "Ŕ",
  193: "Á",
  194: "Â",
  195: "Ă",
  196: "Ä",
  197: "Ĺ",
  198: "Ć",
  199: "Ç",
  200: "Č",
  201: "É",
  202: "Ę",
  203: "Ë",
  204: "Ě",
  205: "Í",
  206: "Î",
  207: "Ď",
  208: "Đ",
  209: "Ń",
  210: "Ň",
  211: "Ó",
  212: "Ô",
  213: "Ő",
  214: "Ö",
  215: "×",
  216: "Ř",
  217: "Ů",
  218: "Ú",
  219: "Ű",
  220: "Ü",
  221: "Ý",
  222: "Ţ",
  223: "ß",
  224: "ŕ",
  225: "á",
  226: "â",
  227: "ă",
  228: "ä",
  229: "ĺ",
  230: "ć",
  231: "ç",
  232: "č",
  233: "é",
  234: "ę",
  235: "ë",
  236: "ě",
  237: "í",
  238: "î",
  239: "ď",
  240: "đ",
  241: "ń",
  242: "ň",
  243: "ó",
  244: "ô",
  245: "ő",
  246: "ö",
  247: "÷",
  248: "ř",
  249: "ů",
  250: "ú",
  251: "ű",
  252: "ü",
  253: "ý",
  254: "ţ",
  255: "˙",
};

describe("CP1250", () => {
  it("should convert Central Europe (CP1250) using ^E control character", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          69, // E
          ...Object.keys(characters).map((key) => Number(key)),
        ])
      )
    ).toEqual(Object.values(characters).join(""));
  });
});
