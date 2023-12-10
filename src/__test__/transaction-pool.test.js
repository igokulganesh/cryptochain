import TransactionPool from "../wallet/transaction-pool";
import Transaction from "../wallet/transaction";
import Wallet from "../wallet";

describe("TransactionPool", () => {
  let transaction, transactionPool, senderWallet;

  beforeEach(() => {
    senderWallet = new Wallet();
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: senderWallet,
      recipient: "dummy",
      amount: 100,
    });
  });

  describe("setTransaction", () => {
    it("adds a Transaction", () => {
      transactionPool.setTransaction(transaction);
      expect(transactionPool.transactionMap[transaction.id]).toEqual(
        transaction
      );
    });
  });

  describe("getExistingTransaction()", () => {
    it("returns the exisiting transaction given an input address", () => {
      transactionPool.setTransaction(transaction);
      const exisiting = transactionPool.getExistingTransaction({
        address: senderWallet.publicKey,
      });

      expect(exisiting).toBe(transaction);
    });
  });
});
