import { INITIAL_BALANCE } from "../config";
import { elliptic } from "../utils/elliptic";

export default class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    const keyPair = elliptic.genKeyPair();
    this.publicKey = keyPair.getPublic().encode("hex");
  }
}
