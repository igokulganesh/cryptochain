import { v4 as uuidv4 } from "uuid";
import { verifySignature } from "../utils";

export default class Transaction {
  constructor({ senderWallet, amount, recipient }) {
    this.id = uuidv4();
    this.outputMap = this.createOutputMap({ senderWallet, amount, recipient });
    this.input = this.createInput({ senderWallet });
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

    this.outputMap[senderWallet.publicKey] -= amount;
    this.outputMap[recipient] = amount;
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
}
