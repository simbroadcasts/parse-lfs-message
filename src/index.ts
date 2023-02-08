import { Iconv } from "iconv";

const codepages: Record<string, string> = {
  "^L": "CP1252",
  "^G": "CP1253",
  "^C": "CP1251",
  "^E": "CP1250",
  "^T": "CP1254",
  "^B": "CP1257",
  "^J": "CP932",
  "^H": "CP950",
  "^S": "CP936",
  "^K": "CP949",
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
  "^^": "^",
};

const isMultiByte = (cp: string, c: number) => {
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

function parseLFSMessage(msg: Buffer | string): string {
  let buffer = Buffer.from(msg);

  // Default codepage: Latin 1
  let currentCodepage = "^L";
  let resultString = "";
  let blockStart = 0;
  let blockEnd = 0;
  let iconvCurrent = new Iconv(codepages[currentCodepage], "UTF-8");

  for (let i = 0; i <= buffer.length; i++) {
    if (i === buffer.length || buffer[i] === 0) {
      // End of string
      if (blockStart < blockEnd) {
        // Convert current block if it has data
        resultString += iconvCurrent
          .convert(buffer.slice(blockStart, blockEnd))
          .toString();
      }
      i = buffer.length; // Break out of loop
    } else if (isMultiByte(currentCodepage, buffer[i])) {
      // Skip multi-byte char
      blockEnd += 2;
      i++;
    } else if (buffer[i] === 0x5e) {
      // Found '^'
      let cpCheck = `^${iconvCurrent.convert(buffer.slice(i + 1, i + 2))}`;
      if (codepages.hasOwnProperty(cpCheck)) {
        // Changing codepage
        currentCodepage = cpCheck;
        iconvCurrent = new Iconv(codepages[currentCodepage], "UTF-8");
        if (blockStart < blockEnd) {
          // Convert current block if it has data
          resultString += iconvCurrent
            .convert(buffer.slice(blockStart, blockEnd))
            .toString();
        }
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

  for (let i in specials) {
    resultString = resultString.split(i).join(specials[i]);
  }

  return resultString;
}

export default parseLFSMessage;
