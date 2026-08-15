export declare const createMultiByteDecoder: (encoding: string, isLeadByte: (byte: number) => boolean, singleByteOverrides?: Record<number, string>) => (bytes: Uint8Array) => string;
