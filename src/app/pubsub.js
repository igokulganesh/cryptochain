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
    if (channel === CHANNELS.BLOCKCHAIN) {
      const parsedMessage = JSON.parse(message);
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  async broadcastChain() {
    await this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

export default PubSub;
