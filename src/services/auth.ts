import * as SecureStore from "expo-secure-store";
import { post } from "./helpers.ts";
import { Constants } from "@globals";
import { globals } from "@globals/globals";
import { decode as atob, encode as btoa } from "base-64";
import { TextDecoder, TextEncoder } from "text-encoding";
export const signUp = async (username: string, name: string) => {
  const Crypto = window.crypto.subtle;
  /*
        HP:

        First we need to generate two RSA-4096 keypairs. One of these pairs will be for the USER, and the other for the DEVICE.
        We should store those keys in the secure storage accordingly.
        Once stored, we'll send a packet containing the requested username, device name, etc -- signed using the keypair of the user & device

        We should probally considering building an API to search existing usernames BEFORE key generation for efficency;
        This should surfice for the demo, though.
        */
  function arrayBufferFromString(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  function hash(input: string) {
    const utf8 = new TextEncoder().encode(input);
    return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    });
  }

  let existingDeviceKey = importExistingKeypair(
    await SecureStore.getItemAsync(Constants.SECURE_STORAGE_DEVICE),
  );
  let existingUserKey = importExistingKeypair(
    await SecureStore.getItemAsync(Constants.SECURE_STORAGE_USER),
  );

  function importExistingKeypair(encodedJson: string) {
    if (!encodedJson) return null;
    let obj = JSON.parse(atob(encodedJson));
    for (let i = 0; i < 1; i++) {
      let key = i === 0 ? "publicKey" : "privateKey";
      obj[key].algorithm.publicExponent = new Uint8Array(
        Object.values(obj[key].algorithm.publicExponent),
      );
    }
    return obj;
  }

  // CHANGE THESE BACK TO 4096 POST TESTING!!!!!!!
  const userKeypair = existingUserKey || await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 512,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  if (!existingUserKey) {
    await SecureStore.setItemAsync(
      Constants.SECURE_STORAGE_USER,
      btoa(JSON.stringify(userKeypair)),
    );
  }
  const deviceKeypair = existingDeviceKey || await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 512,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  if (!existingDeviceKey) {
    await SecureStore.setItemAsync(
      Constants.SECURE_STORAGE_DEVICE,
      btoa(JSON.stringify(deviceKeypair)),
    );
  }
  // @ts-ignore
  function ab2str(buf) {
    // @ts-ignore
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  /*
          Export the given key and write it into the "exported-key" space.
          */
  // @ts-ignore
  async function exportCryptoPublicKey(key, type) {
    const exported = await crypto.subtle.exportKey(
      type === "public" ? "spki" : "pkcs8",
      key,
    );
    const exportedAsString = ab2str(exported);
    const exportedAsBase64 = btoa(exportedAsString);
    const pemExported = `-----BEGIN ${
      type === "private" ? "PRIVATE" : "PUBLIC"
    } KEY-----\n${exportedAsBase64}\n-----END ${
      type === "private" ? "PRIVATE" : "PUBLIC"
    } KEY-----`;

    return pemExported;
  }

  async function signRSA(
    message: string,
    privateKey: CryptoKey,
    publicKey: CryptoKey,
  ) {
    const enc = new TextEncoder();
    const def = new TextDecoder();
    let sig = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      privateKey,
      enc.encode(message),
    );
    let encstr = btoa(ab2str(sig));
    return encstr;
  }

  let unsignedDevice = {
    id: null,
    name: username + "'s device",
    publicKey: btoa(
      await exportCryptoPublicKey(deviceKeypair.publicKey, "public"),
    ),
  };

  let deviceHash = await hash(JSON.stringify(unsignedDevice));
  let unsignedTX = {
    prevHash: null,
    type: "newUser",
    body: {
      id: null,
      username: username,
      name: name,
      publicKey: btoa(
        await exportCryptoPublicKey(userKeypair.publicKey, "public"),
      ),
      deviceHash: deviceHash,
      deviceSignature: await signRSA(
        deviceHash,
        deviceKeypair.privateKey,
        deviceKeypair.publicKey,
      ),
      device: unsignedDevice,
    },
  };

  let request = {
    txHash: await hash(JSON.stringify(unsignedTX)),
    signature: await signRSA(
      await hash(JSON.stringify(unsignedTX)),
      userKeypair.privateKey,
      userKeypair.publicKey,
    ),
    tx: unsignedTX,
  };
  try {
    await post(Constants.PRISM_BASE_URL, "newUser", request);
    globals.loggedInUser = {
      username: username,
      name: name,
      followers: 0,
      following: 0,
      description: "",
      image: Constants.IPFS_GATEWAY_URL + Constants.DEFAULT_PROFILE_PICTURE,
      verified: false,
    };
    return true;
  } catch (e) {
    return false;
  }
};
