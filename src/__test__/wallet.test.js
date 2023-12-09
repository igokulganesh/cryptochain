import Wallet from "../wallet";
import { verifySignature } from "../utils";

describe("Wallet()", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a `publicKey`", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("Signing data", () => {
    const data = "some-data";

    it("verifies a valid signature", () => {
      expect(
        verifySignature({
          data,
          publicKey: wallet.publicKey,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it("does not verify an invalid signature", () => {
      expect(
        verifySignature({
          data,
          publicKey: wallet.publicKey,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });
});
