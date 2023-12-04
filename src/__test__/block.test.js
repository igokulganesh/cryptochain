import Block from "../block.js";

describe("Block", () => {
    const data = ["some-data", "random-data"];
    const timestamp = "current-time";
    const lasthash = "last-hash";
    const hash = "hash";
    const block = new Block({
        data, 
        timestamp,
        lasthash,
        hash
    });
    
    it("has a all the property exits", () => {
        expect(block.timestamp).toEqual(timestamp);
    }); 
});