import express from "express";
import bodyParser from "body-parser";
import request from "request";
import Blockchain from "./blockchain/index.js";
import PubSub from "./app/pubsub.js";
import TransactionPool from "./wallet/transaction-pool.js";
import Wallet from "./wallet/index.js";

const DEFUALT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFUALT_PORT}`;

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
await pubsub.initilize();

const transactionPool = new TransactionPool();
const wallet = new Wallet();

const app = express();
app.use(bodyParser.json());

app.get("/api/blocks", (_req, res) => {
  console.log("GET: /api/block");
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  console.log("POST: /api/mine", req.body);
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

app.post("/api/transact", (req, res) => {
  console.log("POST: /api/transact");

  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction({ recipient, amount });
  transactionPool.setTransaction(transaction);

  console.log(transactionPool);

  res.json(transaction);
});

const syncChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
        console.log("Updating chain on sync with root chain...");
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
  if (PORT !== DEFUALT_PORT) syncChains();
});
