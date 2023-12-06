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

  res.redirect("/api/blocks");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App Started\nListening at localhost:${PORT}`);
});
