import { verifySignature } from "../utils";
import Wallet from "../wallet";
import Transaction from "../wallet/transaction";

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "recipient-publickey";
    amount = 100;

    transaction = new Transaction({ amount, recipient, senderWallet });
  });

  it("has a `id` field", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has a `outputMap`", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the `senderWallet`", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has a `input`", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has a `timestamp` in the input", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("sets the `amount` to the `senderWallet` balance", () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the `address` to the `senderWallet` publicKey", () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signs the input", () => {
      const verifies = verifySignature({
        publicKey: senderWallet.publicKey,
        data: transaction.outputMap,
        signature: transaction.input.signature,
      });
      expect(verifies).toBe(true);
    });
  });

  describe("validateTransaction()", () => {
    let errorMock;

    beforeEach(() => {
      errorMock = jest.fn();

      global.console.error = errorMock;
    });

    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.validateTransaction(transaction)).toBe(true);
      });
    });

    describe("When the transaction is invalid", () => {
      describe("and a transaction outputMap value is invalid", () => {
        it("returns true", () => {
          transaction.outputMap[senderWallet.publicKey] = -1000; // changing amount

          expect(Transaction.validateTransaction(transaction)).toBe(false);
        });
      });

      describe("and a transaction outputMap value is invalid", () => {
        it("returns true", () => {
          transaction.input.signature = new Wallet().sign("fake-data");
          expect(Transaction.validateTransaction(transaction)).toBe(false);
        });
      });
    });
  });
});
