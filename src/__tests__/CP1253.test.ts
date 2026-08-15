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
  // 136 unused
  // 137 [‰] not available in LFS
  // 138 unused
  139: "‹",
  // 140 unused
  // 141 unused
  // 142 unused
  // 143 unused
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
  // 157 unused
  // 158 unused
  // 159 unused
  160: " ",
  161: "΅",
  162: "Ά",
  163: "£",
  // 164 [¤] not available in LFS
  165: "¥",
  166: "¦",
  167: "§",
  168: "¨",
  169: "©",
  // 170 unused
  171: "«",
  172: "¬",
  173: "­",
  174: "®",
  175: "―",
  176: "°",
  177: "±",
  178: "²",
  179: "³",
  180: "΄",
  181: "µ",
  182: "¶",
  183: "·",
  184: "Έ",
  185: "Ή",
  186: "Ί",
  187: "»",
  188: "Ό",
  // 189 [½] not available in LFS
  190: "Ύ",
  191: "Ώ",
  192: "ΐ",
  193: "Α",
  194: "Β",
  195: "Γ",
  196: "Δ",
  197: "Ε",
  198: "Ζ",
  199: "Η",
  200: "Θ",
  201: "Ι",
  202: "Κ",
  203: "Λ",
  204: "Μ",
  205: "Ν",
  206: "Ξ",
  207: "Ο",
  208: "Π",
  209: "Ρ",
  // 210 unused
  211: "Σ",
  212: "Τ",
  213: "Υ",
  214: "Φ",
  215: "Χ",
  216: "Ψ",
  217: "Ω",
  218: "Ϊ",
  219: "Ϋ",
  220: "ά",
  221: "έ",
  222: "ή",
  223: "ί",
  224: "ΰ",
  225: "α",
  226: "β",
  227: "γ",
  228: "δ",
  229: "ε",
  230: "ζ",
  231: "η",
  232: "θ",
  233: "ι",
  234: "κ",
  235: "λ",
  236: "μ",
  237: "ν",
  238: "ξ",
  239: "ο",
  240: "π",
  241: "ρ",
  242: "ς",
  243: "σ",
  244: "τ",
  245: "υ",
  246: "φ",
  247: "χ",
  248: "ψ",
  249: "ω",
  250: "ϊ",
  251: "ϋ",
  252: "ό",
  253: "ύ",
  254: "ώ",
  // 255 unused
};

describe("CP1253", () => {
  it("should convert Greek (CP1253) using ^G control character", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          71, // G
          ...Object.keys(characters).map((key) => Number(key)),
        ]),
      ),
    ).toEqual(Object.values(characters).join(""));
  });
});
