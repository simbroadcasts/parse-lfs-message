const controlChar = "^";

const codepages = {
  "8": "CP1252",
  L: "CP1252",
  G: "CP1253",
  C: "CP1251",
  E: "CP1250",
  T: "CP1254",
  B: "CP1257",
  J: "shift-jis",
  H: "big5",
  S: "gbk",
  K: "euc-kr",
} as const;

type Codepage = keyof typeof codepages;

const specials: Record<string, string> = {
  v: "|",
  a: "*",
  c: ":",
  d: "\\",
  s: "/",
  q: "?",
  t: '"',
  l: "<",
  r: ">",
  h: "#",
  "^": "^^",
};

const isMultiByte = (codepage: Codepage, character: number): boolean => {
  switch (codepage) {
    case "L":
    case "8":
    case "G":
    case "C":
    case "E":
    case "T":
    case "B":
      return false;
    case "J":
      return (
        (character > 0x80 && character < 0xa0) ||
        (character >= 0xe0 && character < 0xfd)
      );
    case "H":
    case "S":
    case "K":
      return character > 0x80 && character < 0xff;
    default:
      throw new Error(`Unknown Codepage: ${character}`);
  }
};

function parseLFSMessage(msg: Uint8Array | string): string {
  const buffer =
    typeof msg === "string"
      ? new Uint8Array([...msg].map((c) => c.charCodeAt(0)))
      : msg;

  // Default codepage: Latin 1
  let currentCodepage: Codepage = "L";
  let resultString = "";
  let blockStart = 0;
  let blockEnd = 0;
  let iconvCurrent = new TextDecoder(codepages[currentCodepage]);

  for (let i = 0; i <= buffer.length; i++) {
    if (i === buffer.length || buffer[i] === 0) {
      // End of string
      if (blockStart < blockEnd) {
        // Convert current block if it has data
        resultString += iconvCurrent.decode(buffer.slice(blockStart, blockEnd));
      }
      i = buffer.length; // Break out of loop
    } else if (isMultiByte(currentCodepage, buffer[i])) {
      // Skip multi-byte char
      blockEnd += 2;
      i++;
    } else if (buffer[i] === controlChar.charCodeAt(0)) {
      // Found '^'
      let cpCheck = iconvCurrent.decode(buffer.slice(i + 1, i + 2));
      if (isValidCodepage(cpCheck)) {
        if (blockStart < blockEnd) {
          // Convert current block if it has data
          resultString += iconvCurrent.decode(
            buffer.slice(blockStart, blockEnd)
          );
        }
        // Changing codepage
        currentCodepage = cpCheck;
        iconvCurrent = new TextDecoder(codepages[currentCodepage]);

        // Start a new block
        if (buffer[i + 1] === 0x38) {
          blockStart = i;
        } else {
          blockStart = i + 2;
        }
        blockEnd = i + 2;
        i++;
      } else if (specials.hasOwnProperty(cpCheck)) {
        resultString += specials[cpCheck];

        // Start a new block
        if (buffer[i + 1] === 0x38) {
          blockStart = i;
        } else {
          blockStart = i + 2;
        }
        blockEnd = i + 2;

        i++;
      } else {
        // Skip escaped/colour change character
        blockEnd += 2;
        i++;
      }
    } else {
      // single byte char
      blockEnd++;
    }
  }

  return resultString;
}

function isValidCodepage(codepage: string): codepage is Codepage {
  return codepages.hasOwnProperty(codepage);
}

export default parseLFSMessage;
