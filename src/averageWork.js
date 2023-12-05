import BlockChain from "./blockchain.js";

const blockchain = new BlockChain();

blockchain.addBlock({ data: "first" });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

for (let i = 0; i < 1000; i++) {
  prevTimestamp = blockchain.getLastBlock().timestamp;

  blockchain.addBlock({ data: `Block data ${i}` });

  nextBlock = blockchain.getLastBlock();
  nextTimestamp = nextBlock.timestamp;

  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  average = times.reduce((total, num) => total + num) / times.length;

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms. nonce: ${nextBlock.nonce}\n`
  );
}
