import parseLFSMessage from "../index";
import { asciiCharacterMap } from "./helpers";

const characters = {
  ...asciiCharacterMap,
  // 127 [DEL] not available in LFS
  128: "€",
  // 129-254 excluded: multi-byte lead bytes, tested separately
  // 255 unused
};

describe("Big5 (single-byte page)", () => {
  it("should convert the single-byte Traditional Chinese (Big5) page using ^H control character", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          72, // H
          ...Object.keys(characters).map((key) => Number(key)),
        ]),
      ),
    ).toEqual(Object.values(characters).join(""));
  });
});
