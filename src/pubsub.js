import { createClient } from "redis";

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  async initilize() {
    this.publisher = await createClient()
      .on("error", (err) => console.log("Redis Publisher Client Error", err))
      .connect();

    this.subscriber = await createClient()
      .on("error", (err) => console.log("Redis Subscriber Client Error", err))
      .connect();

    this.subscriber.subscribe(CHANNELS.TEST, this.handleMessage);
  }

  handleMessage(message, channel) {
    console.log(`Channel: ${channel}, Message: ${message}`);
  }
}

export default PubSub;

const testPubsub = new PubSub();
testPubsub
  .initilize()
  .then(() => testPubsub.publisher.publish(CHANNELS.TEST, "Published Message"));
