import { Codepage, createDecoder, Decoder, isValidCodepage } from "./decoder";

const CONTROL_CHAR = "^";
const RESET_COLOUR_AND_CODEPAGE_CHAR = "8";
const CODEPAGE_WAS_RESET_CHAR = "9";

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

type OriginalCodepage = Exclude<Codepage, "8">;

function parseLFSMessage(
  msg: Uint8Array | string,
  options: {
    /**
     * The code page to convert characters from after an `^8` escape code,
     * which means "return to original colour and code page". For client-side
     * LFS messages, the original code page is the selected translation's code page.
     *
     * To get the code page of LFS output messages, read the `MSOData` property
     * in the `IS_MSO` packet.
     *
     * If this option is not provided, the default value is Latin-1 (CP1252).
     */
    originalCodepage?: OriginalCodepage;
  } = {},
): string {
  const { originalCodepage = "L" } = options;

  const buffer =
    typeof msg === "string"
      ? new Uint8Array([...msg].map((c) => c.charCodeAt(0)))
      : msg;

  // Default codepage: Latin 1, unless provided from outside
  let currentCodepage: Codepage = originalCodepage;
  let resultString = "";
  let blockStart = 0;
  let blockEnd = 0;
  let iconvCurrent: Decoder = createDecoder(currentCodepage);

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
    } else if (buffer[i] === CONTROL_CHAR.charCodeAt(0)) {
      // Found '^'
      let cpCheck = iconvCurrent.decode(buffer.slice(i + 1, i + 2));
      const isResetColourAndCodepage =
        cpCheck === RESET_COLOUR_AND_CODEPAGE_CHAR;

      if (isValidCodepage(cpCheck) || isResetColourAndCodepage) {
        if (blockStart < blockEnd) {
          // Convert current block if it has data
          resultString += iconvCurrent.decode(
            buffer.slice(blockStart, blockEnd),
          );
        }
        // Changing codepage
        currentCodepage = isResetColourAndCodepage ? originalCodepage : cpCheck;
        iconvCurrent = createDecoder(currentCodepage);

        // `^8` and `^9` render as the same colour, so `^8` always renders as
        // `^9` in the output.
        if (isResetColourAndCodepage) {
          resultString += CONTROL_CHAR + CODEPAGE_WAS_RESET_CHAR;
        }

        // Start a new block
        blockStart = i + 2;
        blockEnd = i + 2;
        i++;
      } else if (specials.hasOwnProperty(cpCheck)) {
        if (blockStart < blockEnd) {
          // Convert current block if it has data
          resultString += iconvCurrent.decode(
            buffer.slice(blockStart, blockEnd),
          );
        }
        resultString += specials[cpCheck];

        // Start a new block
        if (buffer[i + 1] === RESET_COLOUR_AND_CODEPAGE_CHAR.charCodeAt(0)) {
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

export { Codepage, OriginalCodepage };

export default parseLFSMessage;
