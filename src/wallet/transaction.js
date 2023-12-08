import { v4 as uuidv4 } from "uuid";

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
}
