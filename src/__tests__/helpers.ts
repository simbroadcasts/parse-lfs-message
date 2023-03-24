const asciiStart = 32,
  asciiEnd = 126;

const asciiCharactersTuples = Array(asciiEnd - asciiStart + 1)
  .fill(null)
  .map((_, index) => {
    const asciiIndex = index + asciiStart;
    const character = String.fromCharCode(asciiIndex);

    return [asciiIndex, character] as const;
  });

export const asciiCharacterMap = Object.fromEntries(asciiCharactersTuples);
