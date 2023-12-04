import { GENESIS_DATA } from "./config";
import { cryptoHash } from "./cryptoHash";

class Block {
  constructor({ data, timestamp, lastHash, hash }) {
    this.data = data;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = cryptoHash(data, timestamp, lastHash);

    return new this({ data, timestamp, lastHash, hash });
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }
}

export default Block;
