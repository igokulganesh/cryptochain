import Transaction from "./transaction.js";

export default class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  setTransaction(transaction) {
    if (Transaction.validateTransaction(transaction))
      this.transactionMap[transaction.id] = transaction;
  }

  getExistingTransaction({ address }) {
    const transactions = Object.values(this.transactionMap);

    return transactions.find(
      (transaction) => transaction.input.address === address
    );
  }

  setMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  getValidTransactions() {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validateTransaction(transaction)
    );
  }

  clear() {
    this.transactionMap = {};
  }

  clearBlockchainTransactions({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }
}
