import express from "express";
import bodyParser from "body-parser";
import request from "request";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Blockchain from "./blockchain/index.js";
import PubSub from "./app/pubsub.js";
import TransactionPool from "./wallet/transaction-pool.js";
import Wallet from "./wallet/index.js";
import TransactionMiner from "./app/transaction-miner.js";

const DEFUALT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFUALT_PORT}`;

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();

const pubsub = new PubSub({ blockchain, transactionPool });
await pubsub.initilize();

const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "client/dist")));

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

  let transaction = transactionPool.getExistingTransaction({
    address: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }

    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);

    console.log(transactionPool);

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ type: "error", message: error.message });
  }
});

app.get("/api/transaction-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get("/api/mine-transactions", (req, res) => {
  transactionMiner.mineTransaction();

  res.redirect("/api/blocks");
});

app.get("/api/wallet-info", (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "client", "dist") });
});

const syncWithRootState = () => {
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

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);
        console.log("Updating Transaction Pool Map with root...");
        transactionPool.setMap(rootTransactionPoolMap);
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
  if (PORT !== DEFUALT_PORT) syncWithRootState();
});
