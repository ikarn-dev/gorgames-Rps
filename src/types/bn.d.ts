declare module "bn.js" {
  import { Buffer } from "buffer";
  export default class BN {
    constructor(number: number | string | number[] | Buffer, base?: number, endian?: string);
    toArray(endian?: string, length?: number): number[];
    toBuffer(endian?: string, length?: number): Buffer;
    toString(base?: number): string;
    toNumber(): number;
    // Add more methods as needed
  }
} 