import elliptic from "elliptic";
import { cryptoHash } from "./cryptoHash.js";

const EC = new elliptic.ec("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = EC.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};

export { cryptoHash, verifySignature, EC };
