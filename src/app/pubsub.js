import { createClient } from "redis";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

class PubSub {
  constructor({ blockchain, transactionPool }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
  }

  async initilize() {
    this.publisher = await createClient()
      .on("error", (err) => console.log("Redis Publisher Client Error", err))
      .connect();

    this.subscriber = await createClient()
      .on("error", (err) => console.log("Redis Subscriber Client Error", err))
      .connect();

    this.subcribeToChannels();
  }

  subcribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel, (message, channel) =>
        this.handleMessage(message, channel)
      );
    });
  }

  async publish({ channel, message }) {
    /* 
      Unsubscribe to the channel before publishing message 
      to avoid sending to own network and the resubscribe to it 
    */
    await this.subscriber.unsubscribe(channel);
    await this.publisher.publish(channel, message);
    await this.subscriber.subscribe(channel);
  }

  handleMessage(message, channel) {
    console.log(`Channel:${channel}, Message: ${message}`);
    const parsedMessage = JSON.parse(message);

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage);
        break;

      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage);
        break;

      default:
        return;
    }
  }

  async broadcastChain() {
    await this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  async broadcastTransaction(transaction) {
    await this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

export default PubSub;
