import crypto from "crypto";

export const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");

  hash.update(
    inputs
      .map((item) => JSON.stringify(item))
      .sort()
      .join(" ")
  );

  return hash.digest("hex");
};
