import BlockChain from "../blockchain";
import Block from "../block";
import { cryptoHash } from "../cryptoHash";

describe("BlockChain()", () => {
  let blockchain;
  let errorMock, logMock;

  beforeEach(() => {
    blockchain = new BlockChain();

    errorMock = jest.fn();
    logMock = jest.fn();

    global.console.log = logMock;
    global.console.error = errorMock;
  });

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

  describe("isValidChain()", () => {
    describe("when the chain does not start with genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0].data = "fake-genesis";

        expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Block 1 data" });
        blockchain.addBlock({ data: "Block 2 data" });
        blockchain.addBlock({ data: "Block 3 data" });
      });

      describe("and the lastHash reference has Changed", () => {
        it("returns false", () => {
          blockchain.getLastBlock().lastHash = "broken-Hash";
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.getLastBlock().data = "Changed-data";
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.getLastBlock();
          const timestamp = Date.now();
          const lastHash = lastBlock.hash;
          const nonce = 0;
          const data = "Something";
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const bad_block = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });

          blockchain.chain.push(bad_block);

          expect(BlockChain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and chains is valid", () => {
        it("returns true", () => {
          expect(BlockChain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let newChain, originalChain;

    beforeEach(() => {
      newChain = new BlockChain();
      originalChain = blockchain.chain;
    });

    describe("when the new chain is not longer", () => {
      it("does not replace the chain", () => {
        blockchain.replaceChain(newChain.chain);

        expect(blockchain.chain).toEqual(originalChain);
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "one" });
        newChain.addBlock({ data: "two" });
        newChain.addBlock({ data: "three" });
        newChain.addBlock({ data: "four" });
      });

      describe("and when the chain is inValid", () => {
        it("does not replace the chain", () => {
          newChain.getLastBlock().lastHash = "some-fake-hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toBe(originalChain);
        });
      });

      describe("and when the chain is valid", () => {
        it("replaces the chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toBe(newChain.chain);
        });
      });
    });
  });
});
