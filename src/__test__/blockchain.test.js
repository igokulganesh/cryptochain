import BlockChain from "../blockchain";
import Block from "../block";

describe("BlockChain()", () => {
  const blockchain = new BlockChain();

  it("contains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", () => {
    const data = "some-data";
    blockchain.addBlock({ data });

    expect(blockchain.getLastBlock().data).toEqual(data);
  });
});
