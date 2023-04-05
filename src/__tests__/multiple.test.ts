import parseLFSMessage from "../index";

describe("multiple encodings within a string", () => {
  it("should convert from CP1250, CP1251 and then CP1252", () => {
    expect(
      parseLFSMessage(
        new Uint8Array([
          94, // ^
          69, // E
          248,
          94, // ^
          67, // C
          248,
          94, // ^
          76, // L
          248,
        ])
      )
    ).toEqual("řшø");
  });
});
