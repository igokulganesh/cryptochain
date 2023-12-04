import { GENESIS_DATA } from "./config";

class Block {
  constructor({ data, timestamp, lastHash, hash }) {
    this.data = data;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
  }

  static mineBlock({ lastBlock, data }) {
    return new this({ data, timestamp: Date.now(), lastHash: lastBlock.hash });
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }
}

export default Block;
