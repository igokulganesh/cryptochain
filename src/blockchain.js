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

  replaceChain(chain) {
    if (chain.length < this.chain.length) {
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
      const { data, timestamp, lastHash, hash } = chain[i];

      const actualLastHash = chain[i - 1].hash;

      if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(timestamp, data, lastHash);

      if (hash !== validatedHash) return false;
    }

    return true;
  }
}
