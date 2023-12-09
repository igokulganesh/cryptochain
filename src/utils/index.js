import { ec } from "elliptic";
import { cryptoHash } from "./cryptoHash";

const elliptic = new ec("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = elliptic.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};

export { cryptoHash, verifySignature, elliptic };
