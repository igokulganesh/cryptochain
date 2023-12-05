import Block from "../block";
import { GENESIS_DATA, MINE_RATE } from "../config";
import { cryptoHash } from "../cryptoHash";

describe("Block", () => {
  const data = "some-data";
  const timestamp = 2000;
  const lastHash = "last-hash";
  const hash = "hash";
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    data,
    timestamp,
    lastHash,
    hash,
    nonce,
    difficulty,
  });

  it("has a all the property exits", () => {
    expect(block.data).toEqual(data);
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("Genesis", () => {
    const genesis_block = Block.genesis();

    it("returns a Block Instance", () => {
      expect(genesis_block instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesis_block).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined-data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("returns a Block Instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets the `lastHash` to be the `hash` of the lastBlock", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets the `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("sets the `hash` that matches the difficulty criteria", () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        "0".repeat(minedBlock.difficulty)
      );
    });

    it("creates a sha-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          data,
          lastBlock.hash
        )
      );
    });

    it("adjusts the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("raises the difficulty for quickly mined block", () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: block,
          timestamp: block.timestamp - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty for slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          lastBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ lastBlock: block })).toEqual(1);
    });
  });
});
