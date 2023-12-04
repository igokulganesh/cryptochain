import Block from "../block";
import { GENESIS_DATA } from "../config";
import { cryptoHash } from "../cryptoHash";

describe("Block", () => {
  const data = "some-data";
  const timestamp = "current-time";
  const lastHash = "last-hash";
  const hash = "hash";
  const block = new Block({
    data,
    timestamp,
    lastHash,
    hash,
  });

  it("has a all the property exits", () => {
    expect(block.data).toEqual(data);
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
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

    it("creates a sha-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(data, minedBlock.timestamp, lastBlock.hash)
      );
    });
  });
});
