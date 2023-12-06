import express from "express";
import bodyParser from "body-parser";
import Blockchain from "./blockchain.js";
import PubSub from "./pubsub.js";

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
pubsub.initilize().then(() => {
  pubsub.broadcastChain();
});

app.use(bodyParser.json());

app.get("/api/blocks", (_req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

const DEFUALT_PORT = 3000;
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFUALT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFUALT_PORT;
app.listen(PORT, () => {
  console.log(`App Started\nListening at localhost:${PORT}`);
});
