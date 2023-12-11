export default class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransaction() {
    // get the trasaction pool's Valid transactions
    // generate the miner's reward
    // add a block consisting of these transactions to the blockchain
    // broadcast the updated blockchain
    // clear the pool
  }
}
