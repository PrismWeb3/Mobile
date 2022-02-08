import * as SecureStore from "expo-secure-store";
import { post } from "./helpers.ts";
import {
  arrayBufferToString,
  exportRSAKey,
  hash,
  importExistingKeypair,
  signRSA,
} from "./crypto.ts";
import { Constants } from "@globals";
import { globals } from "@globals/globals";
import { encode as btoa } from "base-64";
import { TextEncoder } from "text-encoding";
export const signUp = async (username: string, name: string) => {
  /*
        HP:

        First we need to generate two RSA-4096 keypairs. One of these pairs will be for the USER, and the other for the DEVICE.
        We should store those keys in the secure storage accordingly.
        Once stored, we'll send a packet containing the requested username, device name, etc -- signed using the keypair of the user & device

        We should probally considering building an API to search existing usernames BEFORE key generation for efficency;
        This should surfice for the demo, though.
        */

  const existingDeviceKey = importExistingKeypair(
    await SecureStore.getItemAsync(Constants.SECURE_STORAGE_DEVICE),
  );
  const existingUserKey = importExistingKeypair(
    await SecureStore.getItemAsync(Constants.SECURE_STORAGE_USER),
  );

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

  const unsignedDevice = {
    id: null,
    name: username + "'s device",
    publicKey: btoa(
      await exportRSAKey(deviceKeypair.publicKey, "public"),
    ),
  };

  const deviceHash = await hash(JSON.stringify(unsignedDevice));
  const unsignedTX = {
    prevHash: null,
    type: "newUser",
    body: {
      id: null,
      username: username,
      name: name,
      publicKey: btoa(
        await exportRSAKey(userKeypair.publicKey, "public"),
      ),
      deviceHash: deviceHash,
      deviceSignature: await signRSA(
        deviceHash,
        deviceKeypair.privateKey,
      ),
      device: unsignedDevice,
    },
  };

  const request = {
    txHash: await hash(JSON.stringify(unsignedTX)),
    signature: await signRSA(
      await hash(JSON.stringify(unsignedTX)),
      userKeypair.privateKey,
    ),
    tx: unsignedTX,
  };

  try {
    const newUser: any = await post(
      Constants.PRISM_BASE_URL,
      "newUser",
      request,
    );
    globals.loggedInUser = {
      id: newUser._id,
      userPublicKey: newUser.userPublicKey,
      username: newUser.username,
      name: newUser.name,
      followers: newUser.followers,
      following: newUser.following,
      bio: newUser.bio,
      image: Constants.IPFS_GATEWAY_URL + newUser.avatarHash,
      verified: newUser.verifed,
    };
    return true;
  } catch (e) {
    return false;
  }
};
