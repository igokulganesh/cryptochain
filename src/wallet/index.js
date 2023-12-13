import { INITIAL_BALANCE } from "../config.js";
import { EC, cryptoHash } from "../utils/index.js";
import Transaction from "./transaction.js";

export default class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = EC.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ amount, recipient, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (this.balance < amount) throw new Error("Amount exceeds balance");

    return new Transaction({ senderWallet: this, amount, recipient });
  }

  static calculateBalance({ chain, address }) {
    let outputsTotal = 0;
    let hasMadeTransaction = false;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (transaction.input.address === address) hasMadeTransaction = true;

        const output = transaction.outputMap[address];

        if (output) {
          outputsTotal += output;
        }
      }

      if (hasMadeTransaction) break;
    }

    return hasMadeTransaction ? outputsTotal : INITIAL_BALANCE + outputsTotal;
  }
}
