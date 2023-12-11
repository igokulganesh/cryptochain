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

  describe("getValidTransactions()", () => {
    let validTransactions, errorMock;

    beforeEach(() => {
      validTransactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: "some-dummy",
          amount: 25,
        });

        if (i % 3 === 0) {
          transaction.input.amount = 999999;
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign("fake");
        } else {
          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });

    it("returns valid transactions", () => {
      expect(transactionPool.getValidTransactions()).toEqual(validTransactions);
    });
  });
});
