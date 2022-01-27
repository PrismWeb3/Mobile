import { post } from "@services";
import { Constants } from "@globals";

function authorizeDerivedKey(
  publicKey: string,
  derivedPublicKey: string,
  accessSignature: string,
  expirationBlock: number,
  deleteKey: boolean,
) {
  const route = "authorize-derived-key";

  return post(
    Constants.DESO_BASE_URL,
    route,
    {
      OwnerPublicKeyBase58Check: publicKey,
      DerivedPublicKeyBase58Check: derivedPublicKey,
      ExpirationBlock: expirationBlock,
      AccessSignature: accessSignature,
      DeleteKey: deleteKey,
      MinFeeRateNanosPerKB: 10000,
    },
  );
}

const appendExtraDataToTransaction = (
  transactionHex: string,
  derivedPublicKey: string,
) => {
  const route = "append-extra-data";

  return post(
    Constants.DESO_BASE_URL,
    route,
    {
      TransactionHex: transactionHex,
      ExtraData: {
        DerivedPublicKey: derivedPublicKey,
      },
    },
  );
};

const submitTransaction = (p_transactionHex: string) => {
  const route = "submit-transaction";

  return post(
    Constants.DESO_BASE_URL,
    route,
    {
      TransactionHex: p_transactionHex,
    },
  );
};

const getUsersDerivedKeys = (
  publicKey: string,
) => {
  const route = "get-user-derived-keys";

  return post(
    Constants.DESO_BASE_URL,
    route,
    {
      PublicKeyBase58Check: publicKey,
    },
  );
};

export const deSoApi = {
  authorizeDerivedKey,
  appendExtraDataToTransaction,
  submitTransaction,
  getUsersDerivedKeys,
};
