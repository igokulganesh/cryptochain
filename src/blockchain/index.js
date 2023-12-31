import Block from "./block.js";
import { cryptoHash } from "../utils/cryptoHash.js";
import hexToBinary from "hex-to-binary";
import Transaction from "../wallet/transaction.js";
import { MINING_REWARD, REWARD_INPUT } from "../config.js";
import Wallet from "../wallet/index.js";

export default class BlockChain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.getLastBlock(),
      data,
    });
    this.chain.push(newBlock);
  }

  replaceChain(chain, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("The Incoming chain must be longer");
      return;
    }

    if (!BlockChain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (!this.validTransactionData({ chain })) {
      console.error("The incomming chain has invalid transaction data");
      return;
    }

    if (onSuccess) onSuccess();

    console.log("\nReplacing Chain with: \n", chain);
    this.chain = chain;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;

    for (let i = 1; i < chain.length; i++) {
      const { data, timestamp, lastHash, hash, nonce, difficulty } = chain[i];

      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      // Check LastHash set Properly
      if (lastHash !== actualLastHash) return false;

      // Check difficulty changes by 1 only
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      // Check each block contains leading 0 with difficulty
      if (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty))
        return false;

      const validatedHash = cryptoHash(
        timestamp,
        data,
        lastHash,
        difficulty,
        nonce
      );

      // Check each block has valid hash
      if (hash !== validatedHash) return false;
    }

    return true;
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        // if transactions contains multiple rewards
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount++;
          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceed limit");
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.validateTransaction(transaction)) {
            console.error("Invalid Transaction");
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });

          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid Input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            );
            return false;
          }

          transactionSet.add(transaction);
        }
      }
    }

    return true;
  }
}
