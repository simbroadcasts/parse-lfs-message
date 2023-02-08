import parseLFSMessage from "../index";

describe("special characters", () => {
  it("should convert escape codes to special characters", () => {
    expect(parseLFSMessage("^v")).toEqual("|");
    expect(parseLFSMessage("^a")).toEqual("*");
    expect(parseLFSMessage("^c")).toEqual(":");
    expect(parseLFSMessage("^d")).toEqual("\\");
    expect(parseLFSMessage("^s")).toEqual("/");
    expect(parseLFSMessage("^q")).toEqual("?");
    expect(parseLFSMessage("^t")).toEqual('"');
    expect(parseLFSMessage("^l")).toEqual("<");
    expect(parseLFSMessage("^r")).toEqual(">");
    expect(parseLFSMessage("^h")).toEqual("#");
    expect(parseLFSMessage("^^")).toEqual("^");
  });
});
