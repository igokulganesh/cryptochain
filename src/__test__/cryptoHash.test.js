import { cryptoHash } from "../utils";

describe("cryptoHash()", () => {
  it("generate a SHA-256 Hashed output", () => {
    expect(cryptoHash("gokul")).toEqual(
      "b19d2c27ce7f3b5b25ae0bffc6b70a32e439585df28589c13cb0a5e59a0a7684"
    );
  });

  it("produces the same hash with same input arguments in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("three", "two", "one")
    );
  });

  it("produces a unique hash when the properties have changed on a input", () => {
    const obj = {};
    const originalHash = cryptoHash(obj);
    obj["data"] = "abc";

    expect(cryptoHash(obj)).not.toEqual(originalHash);
  });
});
