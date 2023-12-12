import Transaction from "../wallet/transaction.js";

export default class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransaction() {
    // get the trasaction pool's Valid transactions
    const validTransactions = this.transactionPool.getValidTransactions();

    // generate the miner's reward
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );

    // add a block consisting of these transactions to the blockchain
    this.blockchain.addBlock({ data: validTransactions });

    // broadcast the updated blockchain
    this.pubsub.broadcastChain();

    // clear the pool
    this.transactionPool.clear();
  }
}
