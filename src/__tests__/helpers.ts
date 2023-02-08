const asciiStart = 32,
  asciiEnd = 126;

export const asciiCharacters = Array(asciiEnd - asciiStart + 1)
  .fill(null)
  .map((_, index) => index + asciiStart);
