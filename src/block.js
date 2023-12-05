import { GENESIS_DATA, MINE_RATE } from "./config.js";
import { cryptoHash } from "./cryptoHash.js";
import hexToBinary from "hex-to-binary";

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
    let hash, difficulty, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        lastBlock,
        timestamp,
      });
      hash = cryptoHash(data, lastHash, difficulty, nonce, timestamp);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new this({ data, timestamp, lastHash, hash, nonce, difficulty });
  }

  static adjustDifficulty({ lastBlock, timestamp }) {
    const { difficulty } = lastBlock;

    if (difficulty < 1) return 1;

    if (timestamp - lastBlock.timestamp > MINE_RATE) return difficulty - 1;

    return difficulty + 1;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }
}

export default Block;
