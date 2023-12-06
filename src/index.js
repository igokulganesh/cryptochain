import express, { response } from "express";
import bodyParser from "body-parser";
import request from "request";
import Blockchain from "./blockchain.js";
import PubSub from "./pubsub.js";

const DEFUALT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFUALT_PORT}`;

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
pubsub.initilize().then(() => {
  pubsub.broadcastChain();
});

const app = express();
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

const syncChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
        console.log("Updating chain on sync with root chain", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};

let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFUALT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFUALT_PORT;
app.listen(PORT, () => {
  console.log(`App Started\nListening at localhost:${PORT}`);
  syncChains();
});
