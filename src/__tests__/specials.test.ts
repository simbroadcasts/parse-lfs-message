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

  it("should not convert escape characters if preceded by ^", () => {
    expect(parseLFSMessage("^^v")).toEqual("^v");
    expect(parseLFSMessage("^^a")).toEqual("^a");
    expect(parseLFSMessage("^^c")).toEqual("^c");
    expect(parseLFSMessage("^^d")).toEqual("^d");
    expect(parseLFSMessage("^^s")).toEqual("^s");
    expect(parseLFSMessage("^^q")).toEqual("^q");
    expect(parseLFSMessage("^^t")).toEqual("^t");
    expect(parseLFSMessage("^^l")).toEqual("^l");
    expect(parseLFSMessage("^^r")).toEqual("^r");
    expect(parseLFSMessage("^^h")).toEqual("^h");
  });

  it("should not convert colour escape codes", () => {
    expect(parseLFSMessage("^1")).toEqual("^1");
    expect(parseLFSMessage("^^1")).toEqual("^1");
  });

  it("should not convert codepage escape characters if preceded by ^", () => {
    expect(parseLFSMessage("^^L")).toEqual("^L");
    expect(parseLFSMessage("^^G")).toEqual("^G");
    expect(parseLFSMessage("^^C")).toEqual("^C");
    expect(parseLFSMessage("^^E")).toEqual("^E");
    expect(parseLFSMessage("^^T")).toEqual("^T");
    expect(parseLFSMessage("^^B")).toEqual("^B");
    expect(parseLFSMessage("^^H")).toEqual("^H");
    expect(parseLFSMessage("^^S")).toEqual("^S");
    expect(parseLFSMessage("^^K")).toEqual("^K");
    expect(parseLFSMessage("^^J\xCF")).toEqual("^J\xCF");
  });
});
