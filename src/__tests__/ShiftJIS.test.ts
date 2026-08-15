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

describe("Shift-JIS (single-byte page)", () => {
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
