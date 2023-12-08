import { INITIAL_BALANCE } from "../config";
import { elliptic } from "../utils/elliptic";
import { cryptoHash } from "../utils/cryptoHash";

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
