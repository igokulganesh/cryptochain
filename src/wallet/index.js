import { INITIAL_BALANCE } from "../config";
import { elliptic, cryptoHash } from "../utils";
import Transaction from "./transaction";

export default class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = elliptic.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ amount, recipient }) {
    if (this.balance < amount) throw new Error("Amount exceeds balance");

    return new Transaction({ senderWallet: this, amount, recipient });
  }
}
