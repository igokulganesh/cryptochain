import { ec } from "elliptic";
import { cryptoHash } from "./cryptoHash";

export const elliptic = new ec("secp256k1");

export const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = elliptic.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};
