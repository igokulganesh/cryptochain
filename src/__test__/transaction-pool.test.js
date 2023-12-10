import TransactionPool from "../wallet/transaction-pool";
import Transaction from "../wallet/transaction";
import Wallet from "../wallet";

describe("TransactionPool", () => {
  let transaction, transactionPool;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: new Wallet(),
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

  describe("", () => {});
});
