import { createClient } from "redis";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
  }

  async initilize() {
    this.publisher = await createClient()
      .on("error", (err) => console.log("Redis Publisher Client Error", err))
      .connect();

    this.subscriber = await createClient()
      .on("error", (err) => console.log("Redis Subscriber Client Error", err))
      .connect();

    this.subscriber.subscribe(CHANNELS.BLOCKCHAIN, (message, channel) =>
      this.handleMessage(message, channel)
    );
  }

  publish({ channel, message }) {
    this.publisher.publish(channel, message);
  }

  handleMessage(message, channel) {
    if (channel === CHANNELS.BLOCKCHAIN) {
      const parsedMessage = JSON.parse(message);
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

export default PubSub;
