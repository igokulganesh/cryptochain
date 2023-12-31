import { MINING_REWARD, REWARD_INPUT } from "../config";
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

  describe("update()", () => {
    let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

    beforeEach(() => {
      originalSignature = transaction.input.signature;
      originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
      nextRecipient = "next-recipient";
      nextAmount = 50;

      transaction.update({
        senderWallet,
        recipient: nextRecipient,
        amount: nextAmount,
      });
    });

    describe("and the amount is valid", () => {
      it("outputs the amount to the next recipient", () => {
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      });

      it("subtracts the amount from the original sender output amount", () => {
        expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
          originalSenderOutput - nextAmount
        );
      });

      it("maintains a total output that matches the input amount", () => {
        expect(Transaction.calculateOutputTotal(transaction.outputMap)).toEqual(
          transaction.input.amount
        );
      });

      it("re-sign the transaction", () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });

      describe("and another update for the same recipient", () => {
        let addedAmount;

        beforeEach(() => {
          addedAmount = 150;
          transaction.update({
            senderWallet,
            recipient: nextRecipient,
            amount: addedAmount,
          });
        });

        it("adds to the recipient amount", () => {
          expect(transaction.outputMap[nextRecipient]).toEqual(
            nextAmount + addedAmount
          );
        });

        it("substracts the amount from the original sender output amount", () => {
          expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          );
        });
      });
    });

    describe("and the amount is invalid", () => {
      it("throws an error", () => {
        expect(() =>
          transaction.update({
            senderWallet,
            recipient: "dummy",
            amount: 999999,
          })
        ).toThrow("Not enough balance in SenderWallet");
      });
    });
  });

  describe("rewardTransaction()", () => {
    let rewardTransaction, minerWallet;

    beforeEach(() => {
      minerWallet = new Wallet();
      rewardTransaction = Transaction.rewardTransaction({ minerWallet });
    });

    it("creates a transaction with the reward input", () => {
      expect(rewardTransaction.input).toEqual(REWARD_INPUT);
    });

    it("creates one transaction for the miner with the `MINING_REWARD`", () => {
      expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(
        MINING_REWARD
      );
    });
  });
});
