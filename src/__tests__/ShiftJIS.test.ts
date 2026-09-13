import parseLFSMessage from "../index";
import { asciiCharacterMap } from "./helpers";

const characters = {
  ...asciiCharacterMap,
  // 92 [\] displayed as \u00a5 (¥) per JIS X 0201 Roman
  92: "¥",
  // 127 [DEL] not available in LFS
  128: "€",
  // 129-159 excluded: multi-byte lead bytes, tested separately
  // 160 unused
  161: "｡",
  162: "｢",
  163: "｣",
  164: "､",
  165: "･",
  166: "ｦ",
  167: "ｧ",
  168: "ｨ",
  169: "ｩ",
  170: "ｪ",
  171: "ｫ",
  172: "ｬ",
  173: "ｭ",
  174: "ｮ",
  175: "ｯ",
  176: "ｰ",
  177: "ｱ",
  178: "ｲ",
  179: "ｳ",
  180: "ｴ",
  181: "ｵ",
  182: "ｶ",
  183: "ｷ",
  184: "ｸ",
  185: "ｹ",
  186: "ｺ",
  187: "ｻ",
  188: "ｼ",
  189: "ｽ",
  190: "ｾ",
  191: "ｿ",
  192: "ﾀ",
  193: "ﾁ",
  194: "ﾂ",
  195: "ﾃ",
  196: "ﾄ",
  197: "ﾅ",
  198: "ﾆ",
  199: "ﾇ",
  200: "ﾈ",
  201: "ﾉ",
  202: "ﾊ",
  203: "ﾋ",
  204: "ﾌ",
  205: "ﾍ",
  206: "ﾎ",
  207: "ﾏ",
  208: "ﾐ",
  209: "ﾑ",
  210: "ﾒ",
  211: "ﾓ",
  212: "ﾔ",
  213: "ﾕ",
  214: "ﾖ",
  215: "ﾗ",
  216: "ﾘ",
  217: "ﾙ",
  218: "ﾚ",
  219: "ﾛ",
  220: "ﾜ",
  221: "ﾝ",
  222: "ﾞ",
  223: "ﾟ",
  // 224-252 excluded: multi-byte lead bytes, tested separately
  // 253 unused
  // 254 unused
  // 255 unused
};

// First and last assigned trail byte per symbol-page lead byte
// to exercise the lead/trail byte slicing across the full trail-byte range
// https://en.wikipedia.org/wiki/JIS_X_0208#0x21 (and neighbouring #0x22-#0x2D sections)
const symbolPageBoundarySamples: {
  leadByte: number;
  trailByte: number;
  expected: string;
  description: string;
}[] = [
  {
    leadByte: 0x81,
    trailByte: 0x40,
    expected: "　",
    description: "0x81 first (JIS row 1 start)",
  },
  {
    leadByte: 0x81,
    trailByte: 0xfc,
    expected: "◯",
    description: "0x81 last (JIS row 2 end)",
  },
  {
    leadByte: 0x82,
    trailByte: 0x4f,
    expected: "０",
    description: "0x82 first (JIS row 3 start)",
  },
  {
    leadByte: 0x82,
    trailByte: 0xf1,
    expected: "ん",
    description: "0x82 last (JIS row 4 end)",
  },
  {
    leadByte: 0x83,
    trailByte: 0x40,
    expected: "ァ",
    description: "0x83 first (JIS row 5 start)",
  },
  {
    leadByte: 0x83,
    trailByte: 0xd6,
    expected: "ω",
    description: "0x83 last (JIS row 6 end)",
  },
  {
    leadByte: 0x84,
    trailByte: 0x40,
    expected: "А",
    description: "0x84 first (JIS row 7 start)",
  },
  {
    leadByte: 0x84,
    trailByte: 0xbe,
    expected: "╂",
    description: "0x84 last (JIS row 8 end)",
  },
  {
    leadByte: 0x87,
    trailByte: 0x40,
    expected: "①",
    description: "0x87 first (JIS row 13 start)",
  },
  {
    leadByte: 0x87,
    trailByte: 0x9c,
    expected: "∪",
    description: "0x87 last (JIS row 13 end)",
  },
];

const remainingLeadByteSamples: {
  leadByte: number;
  trailByte: number;
  expected: string;
  description: string;
}[] = [
  {
    leadByte: 0x85,
    trailByte: 0x40,
    expected: "�",
    description: "0x85 (rows 9-10, unassigned in CP932)",
  },
  {
    leadByte: 0x86,
    trailByte: 0x40,
    expected: "�",
    description: "0x86 (rows 11-12, unassigned in CP932)",
  },
  {
    leadByte: 0x88,
    trailByte: 0x9f,
    expected: "亜",
    description: "0x88 (kanji level 1 start)",
  },
  { leadByte: 0x89, trailByte: 0x40, expected: "院", description: "0x89" },
  { leadByte: 0x8a, trailByte: 0x40, expected: "魁", description: "0x8a" },
  { leadByte: 0x8b, trailByte: 0x40, expected: "機", description: "0x8b" },
  { leadByte: 0x8c, trailByte: 0x40, expected: "掘", description: "0x8c" },
  { leadByte: 0x8d, trailByte: 0x40, expected: "后", description: "0x8d" },
  { leadByte: 0x8e, trailByte: 0x40, expected: "察", description: "0x8e" },
  { leadByte: 0x8f, trailByte: 0x40, expected: "宗", description: "0x8f" },
  { leadByte: 0x90, trailByte: 0x40, expected: "拭", description: "0x90" },
  { leadByte: 0x91, trailByte: 0x40, expected: "繊", description: "0x91" },
  { leadByte: 0x92, trailByte: 0x40, expected: "叩", description: "0x92" },
  { leadByte: 0x93, trailByte: 0x40, expected: "邸", description: "0x93" },
  { leadByte: 0x94, trailByte: 0x40, expected: "如", description: "0x94" },
  { leadByte: 0x95, trailByte: 0x40, expected: "鼻", description: "0x95" },
  { leadByte: 0x96, trailByte: 0x40, expected: "法", description: "0x96" },
  { leadByte: 0x97, trailByte: 0x40, expected: "諭", description: "0x97" },
  { leadByte: 0x98, trailByte: 0x40, expected: "蓮", description: "0x98" },
  { leadByte: 0x99, trailByte: 0x40, expected: "僉", description: "0x99" },
  { leadByte: 0x9a, trailByte: 0x40, expected: "咫", description: "0x9a" },
  { leadByte: 0x9b, trailByte: 0x40, expected: "奸", description: "0x9b" },
  { leadByte: 0x9c, trailByte: 0x40, expected: "廖", description: "0x9c" },
  { leadByte: 0x9d, trailByte: 0x40, expected: "戞", description: "0x9d" },
  { leadByte: 0x9e, trailByte: 0x40, expected: "曄", description: "0x9e" },
  {
    leadByte: 0x9f,
    trailByte: 0x40,
    expected: "檗",
    description: "0x9f (kanji level 1 end)",
  },
  {
    leadByte: 0xe0,
    trailByte: 0x40,
    expected: "漾",
    description: "0xe0 (kanji level 2 continues)",
  },
  { leadByte: 0xe1, trailByte: 0x40, expected: "瓠", description: "0xe1" },
  { leadByte: 0xe2, trailByte: 0x40, expected: "磧", description: "0xe2" },
  { leadByte: 0xe3, trailByte: 0x40, expected: "紂", description: "0xe3" },
  { leadByte: 0xe4, trailByte: 0x40, expected: "隋", description: "0xe4" },
  { leadByte: 0xe5, trailByte: 0x40, expected: "蕁", description: "0xe5" },
  { leadByte: 0xe6, trailByte: 0x40, expected: "襦", description: "0xe6" },
  { leadByte: 0xe7, trailByte: 0x40, expected: "蹇", description: "0xe7" },
  { leadByte: 0xe8, trailByte: 0x40, expected: "錙", description: "0xe8" },
  { leadByte: 0xe9, trailByte: 0x40, expected: "顱", description: "0xe9" },
  { leadByte: 0xea, trailByte: 0x40, expected: "鵝", description: "0xea" },
  {
    leadByte: 0xeb,
    trailByte: 0x40,
    expected: "�",
    description: "0xeb (unassigned in CP932)",
  },
  {
    leadByte: 0xec,
    trailByte: 0x40,
    expected: "�",
    description: "0xec (unassigned in CP932)",
  },
  {
    leadByte: 0xed,
    trailByte: 0x40,
    expected: "纊",
    description: "0xed (IBM extension kanji)",
  },
  { leadByte: 0xee, trailByte: 0x40, expected: "犾", description: "0xee" },
  {
    leadByte: 0xef,
    trailByte: 0x40,
    expected: "�",
    description: "0xef (unassigned in CP932)",
  },
  {
    leadByte: 0xf0,
    trailByte: 0x40,
    expected: "",
    description: "0xf0 (user-defined/private-use area)",
  },
  { leadByte: 0xf1, trailByte: 0x40, expected: "", description: "0xf1" },
  { leadByte: 0xf2, trailByte: 0x40, expected: "", description: "0xf2" },
  { leadByte: 0xf3, trailByte: 0x40, expected: "", description: "0xf3" },
  { leadByte: 0xf4, trailByte: 0x40, expected: "", description: "0xf4" },
  { leadByte: 0xf5, trailByte: 0x40, expected: "", description: "0xf5" },
  { leadByte: 0xf6, trailByte: 0x40, expected: "", description: "0xf6" },
  { leadByte: 0xf7, trailByte: 0x40, expected: "", description: "0xf7" },
  { leadByte: 0xf8, trailByte: 0x40, expected: "", description: "0xf8" },
  { leadByte: 0xf9, trailByte: 0x40, expected: "", description: "0xf9" },
  {
    leadByte: 0xfa,
    trailByte: 0x40,
    expected: "ⅰ",
    description: "0xfa (IBM extension symbols resume)",
  },
  { leadByte: 0xfb, trailByte: 0x40, expected: "涖", description: "0xfb" },
  {
    leadByte: 0xfc,
    trailByte: 0x40,
    expected: "髜",
    description: "0xfc (last valid lead byte)",
  },
];

describe("Shift-JIS", () => {
  describe("single-byte page", () => {
    it("should convert the single-byte Shift-JIS (CP932) page using ^J control character", () => {
      expect(
        parseLFSMessage(
          new Uint8Array([
            94, // ^
            74, // J
            ...Object.keys(characters).map((key) => Number(key)),
          ]),
        ),
      ).toEqual(Object.values(characters).join(""));
    });
  });

  describe("double-byte pages", () => {
    describe("symbol pages (boundary bytes)", () => {
      it.each(symbolPageBoundarySamples)(
        "should decode lead byte $description",
        ({ leadByte, trailByte, expected }) => {
          expect(
            parseLFSMessage(
              new Uint8Array([
                94, // ^
                74, // J
                leadByte,
                trailByte,
              ]),
            ),
          ).toEqual(expected);
        },
      );
    });

    describe("kanji pages and unassigned lead bytes (sampled)", () => {
      it.each(remainingLeadByteSamples)(
        "should decode lead byte $description",
        ({ leadByte, trailByte, expected }) => {
          expect(
            parseLFSMessage(
              new Uint8Array([
                94, // ^
                74, // J
                leadByte,
                trailByte,
              ]),
            ),
          ).toEqual(expected);
        },
      );
    });
  });
});
