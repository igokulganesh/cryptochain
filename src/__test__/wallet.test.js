import Wallet from "../wallet";
import { verifySignature } from "../utils";
import Transaction from "../wallet/transaction";
import BlockChain from "../blockchain";
import { INITIAL_BALANCE } from "../config";

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

  describe("createTransaction()", () => {
    describe("and the amount exceeds the balance", () => {
      it("throws an error", () => {
        expect(() =>
          wallet.createTransaction({ amount: 999999, recipient: "dummy" })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount valid", () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = "dummy";
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it("creates an instance of `Transaction`", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("matches the transaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("output the amount the recipient", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });
  });

  describe("createTransaction()", () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new BlockChain();
    });

    describe("and the there are no outputs for the wallet", () => {
      it("returns the `INITIAL_BALANCE`", () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey,
        });
        expect(balance).toEqual(INITIAL_BALANCE);
      });
    });

    describe("and the there are outputs for the wallet", () => {
      let transaction_1, transaction_2;

      beforeEach(() => {
        transaction_1 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 100,
        });

        transaction_2 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        });

        blockchain.addBlock({ data: [transaction_1, transaction_2] });
      });

      it("adds the sum of all outputs to the wallet balance", () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey,
        });
        const actualBalance =
          INITIAL_BALANCE +
          transaction_1.outputMap[wallet.publicKey] +
          transaction_2.outputMap[wallet.publicKey];

        expect(balance).toEqual(actualBalance);
      });
    });
  });
});
