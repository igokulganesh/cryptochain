import Block from "./block";
import { cryptoHash } from "./cryptoHash";

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

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { data, timestamp, lastHash, hash } = chain[i];

      const actualLastHash = chain[i - 1].hash;

      if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(timestamp, data, lastHash);

      if (hash !== validatedHash) return false;
    }

    return true;
  }
}
