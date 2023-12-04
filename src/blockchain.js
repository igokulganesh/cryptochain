import Block from "./block";

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
}
