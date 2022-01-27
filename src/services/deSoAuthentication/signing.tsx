/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { crypto } from "./crypto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const sha256 = require("sha256");

const signTransaction = (transactionHex: string, seedHex: string): string => {
  const privateKey = crypto.seedHexToPrivateKey(seedHex);

  const transactionBytes = new Buffer(transactionHex, "hex");
  const transactionHash = new Buffer(sha256.x2(transactionBytes), "hex");
  const signature = privateKey.sign(transactionHash);
  const signatureBytes = new Buffer(signature.toDER());
  const signatureLength = crypto.uintToBuf(signatureBytes.length);

  const signedTransactionBytes = Buffer.concat(
    [
      transactionBytes.slice(0, -1),
      signatureLength,
      signatureBytes,
    ],
  );
  return signedTransactionBytes.toString("hex");
};

export const signing = {
  signTransaction,
};
