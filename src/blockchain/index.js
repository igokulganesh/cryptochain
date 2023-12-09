import Block from "./block.js";
import { cryptoHash } from "../utils";
import hexToBinary from "hex-to-binary";

export default class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.getLastBlock(),
      data,
    });
    this.chain.push(newBlock);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The Incoming chain must be longer");
      return;
    }

    if (!BlockChain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    console.log("\nReplacing Chain with: \n", chain);
    this.chain = chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { data, timestamp, lastHash, hash, nonce, difficulty } = chain[i];

      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      // Check LastHash set Properly
      if (lastHash !== actualLastHash) return false;

      // Check difficulty changes by 1 only
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      // Check each block contains leading 0 with difficulty
      if (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty))
        return false;

      const validatedHash = cryptoHash(
        timestamp,
        data,
        lastHash,
        difficulty,
        nonce
      );

      // Check each block has valid hash
      if (hash !== validatedHash) return false;
    }

    return true;
  }
}