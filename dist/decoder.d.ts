export declare const codepages: {
    /** Default codepage */
    readonly "8": "CP1252";
    /** Latin 1 */
    readonly L: "CP1252";
    /** Greek */
    readonly G: "CP1253";
    /** Cyrillic */
    readonly C: "CP1251";
    /** Central Europe */
    readonly E: "CP1250";
    /** Turkish */
    readonly T: "CP1254";
    /** Baltic */
    readonly B: "CP1257";
    /** Japanese */
    readonly J: "shift-jis";
    /** Traditional Chinese */
    readonly H: "big5";
    /** Simplified Chinese */
    readonly S: "gbk";
    /** Korean */
    readonly K: "euc-kr";
};
export type Codepage = keyof typeof codepages;
export interface Decoder {
    decode(bytes: Uint8Array): string;
}
export declare const createDecoder: (codepage: Codepage) => Decoder;
