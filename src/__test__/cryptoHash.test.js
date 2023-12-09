import { cryptoHash } from "../utils";

describe("cryptoHash()", () => {
  it("generate a SHA-256 Hashed output", () => {
    expect(cryptoHash("gokul")).toEqual(
      "2ce6db3d86b23e69ce4e4c892ffbe5121a0fedb7ccbb6317df15e9362cada4ba"
    );
  });

  it("produces the same hash with same input arguments in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("three", "two", "one")
    );
  });
});
