import parseLFSMessage from "../index";
import { asciiCharacterMap } from "./helpers";

const characters = {
  ...asciiCharacterMap,
  // 92 [\] displayed as ₩ per KS X 1001
  92: "₩",
  // 127 [DEL] not available in LFS
  128: "€",
  // 129-254 excluded: multi-byte lead bytes, tested separately
  // 255 unused
};

describe("EUC-KR (single-byte page)", () => {
  it("should convert the single-byte Korean (EUC-KR) page using ^K control character", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          75, // K
          ...Object.keys(characters).map((key) => Number(key)),
        ]),
      ),
    ).toEqual(Object.values(characters).join(""));
  });
});
