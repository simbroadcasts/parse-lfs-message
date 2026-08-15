export const createMultiByteDecoder = (
  encoding: string,
  isLeadByte: (byte: number) => boolean,
  singleByteOverrides: Record<number, string> = {},
) => {
  const textDecoder = new TextDecoder(encoding);

  return (bytes: Uint8Array): string => {
    let result = "";

    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];

      if (isLeadByte(byte) && i + 1 < bytes.length) {
        result += textDecoder.decode(bytes.slice(i, i + 2));
        i++;
      } else {
        result +=
          singleByteOverrides[byte] ??
          textDecoder.decode(bytes.slice(i, i + 1));
      }
    }

    return result;
  };
};
