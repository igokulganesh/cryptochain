import { GENESIS_DATA, MINE_RATE } from "./config";
import { cryptoHash } from "./cryptoHash";

class Block {
  constructor({ data, timestamp, lastHash, hash, nonce, difficulty }) {
    this.data = data;
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static mineBlock({ lastBlock, data }) {
    const lastHash = lastBlock.hash;
    const difficulty = lastBlock.difficulty;
    let hash;
    let nonce = 0;
    let timestamp = Date.now();

    do {
      nonce++;
      timestamp = Date.now();
      hash = cryptoHash(data, lastHash, difficulty, nonce, timestamp);
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({ data, timestamp, lastHash, hash, nonce, difficulty });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }
}

export default Block;
