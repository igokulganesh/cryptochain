import { INITIAL_BALANCE } from "../config";
import { elliptic, cryptoHash } from "../utils";

export default class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = elliptic.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }
}
