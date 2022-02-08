import { crypto } from "./crypto";
import { DerivedAuthentication } from "@types";
import { Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { signing } from "./signing";
import { deSoApi } from "../desoAPI.ts";
import { wait } from "../helpers";
import * as SecureStore from "expo-secure-store";
import { Constants } from "@globals";

const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

export const authenticateWithDeSoIdentity = async (): Promise<boolean> => {
  const response: AuthSession.AuthSessionResult = await AuthSession.startAsync(
    {
      authUrl:
        `https://identity.deso.org/derive?webview=true&callback=${redirectUri}`,
    },
  );

  if (response.type === "success") {
    const derivedAuthentication: DerivedAuthentication = response
      .params as unknown as DerivedAuthentication;
    derivedAuthentication.expirationBlock = Number(
      derivedAuthentication.expirationBlock,
    );
    derivedAuthentication.compressedDerivedPublicKey = crypto
      .compressPublicKey(derivedAuthentication.derivedPublicKey);

    const authorizationResponse = await deSoApi.authorizeDerivedKey(
      derivedAuthentication.publicKey,
      derivedAuthentication.derivedPublicKey,
      derivedAuthentication.accessSignature,
      derivedAuthentication.expirationBlock,
      false,
    );

    const appendExtraDataResponse = await deSoApi
      .appendExtraDataToTransaction(
        authorizationResponse.TransactionHex as string,
        derivedAuthentication.compressedDerivedPublicKey,
      );

    const signedTransaction = signing.signTransaction(
      appendExtraDataResponse.TransactionHex as string,
      derivedAuthentication.derivedSeedHex,
    );

    await deSoApi.submitTransaction(signedTransaction);
    await wait(3000);
    const derivedKeys = await deSoApi.getUsersDerivedKeys(
      derivedAuthentication.publicKey,
    );

    if (
      derivedKeys.DerivedKeys[derivedAuthentication.derivedPublicKey]?.IsValid
    ) {
      SecureStore.setItemAsync(
        Constants.SECURE_STORAGE_DESO_CONNECTION,
        JSON.stringify(derivedAuthentication),
      );
      return true;
    }
  }

  Alert.alert(
    "Authentication Failed",
    "Authentication with DeSo Identity failed.",
  );
  return false;
};
