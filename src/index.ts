const codepages: Record<string, string> = {
  "^L": "CP1252",
  "^G": "CP1253",
  "^C": "CP1251",
  "^E": "CP1250",
  "^T": "CP1254",
  "^B": "CP1257",
  "^J": "shift-jis",
  "^H": "big5",
  "^S": "gbk",
  "^K": "euc-kr",
  "^8": "CP1252",
};

const specials: Record<string, string> = {
  "^v": "|",
  "^a": "*",
  "^c": ":",
  "^d": "\\",
  "^s": "/",
  "^q": "?",
  "^t": '"',
  "^l": "<",
  "^r": ">",
  "^h": "#",
};

const isMultiByte = (cp: string, c: number): boolean => {
  switch (cp) {
    case "^L":
    case "^8":
    case "^G":
    case "^C":
    case "^E":
    case "^T":
    case "^B":
      return false;
    case "^J":
      return (c > 0x80 && c < 0xa0) || (c >= 0xe0 && c < 0xfd);
    case "^H":
    case "^S":
    case "^K":
      return c > 0x80 && c < 0xff;
    default:
      throw new Error(`Unknown Codepage: ${c}`);
  }
};

function parseLFSMessage(msg: Uint8Array | string): string {
  const buffer =
    typeof msg === "string"
      ? new Uint8Array([...msg].map((c) => c.charCodeAt(0)))
      : msg;

  // Default codepage: Latin 1
  let currentCodepage = "^L";
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
    } else if (buffer[i] === 0x5e) {
      // Found '^'
      let cpCheck = `^${iconvCurrent.decode(buffer.slice(i + 1, i + 2))}`;
      if (codepages.hasOwnProperty(cpCheck)) {
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

  for (let special in specials) {
    const regExp = new RegExp(`(?<!\\^)\\${special}`, "g");
    resultString = resultString.split(regExp).join(specials[special]);
  }

  return resultString;
}

export default parseLFSMessage;
