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
});
