import { v4 as uuidv4 } from "uuid";
import { verifySignature } from "../utils/index.js";
import { MINING_REWARD, REWARD_INPUT } from "../config.js";

export default class Transaction {
  constructor({ senderWallet, amount, recipient, input, outputMap }) {
    this.id = uuidv4();
    this.outputMap =
      outputMap || this.createOutputMap({ senderWallet, amount, recipient });
    this.input = input || this.createInput({ senderWallet });
  }

  createOutputMap({ senderWallet, amount, recipient }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput({ senderWallet }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(this.outputMap),
    };
  }

  update({ senderWallet, amount, recipient }) {
    if (senderWallet.balance < amount)
      throw new Error("Not enough balance in SenderWallet");

    if (!this.outputMap[recipient]) this.outputMap[recipient] = amount;
    else this.outputMap[recipient] += amount;

    this.outputMap[senderWallet.publicKey] -= amount;
    this.input = this.createInput({ senderWallet });
  }

  static validateTransaction(transaction) {
    const {
      outputMap,
      input: { address, amount, signature },
    } = transaction;

    const outputTotal = this.calculateOutputTotal(outputMap);

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!verifySignature({ data: outputMap, publicKey: address, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }

  static calculateOutputTotal(outputMap) {
    return Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount
    );
  }

  static rewardTransaction({ minerWallet }) {
    const reward = new this({
      senderWallet: minerWallet,
      input: REWARD_INPUT,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD },
    });
    return reward;
  }
}
