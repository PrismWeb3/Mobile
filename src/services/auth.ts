import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";
import { post } from "./helpers.ts";
import {
  exportRSAKey,
  hash,
  importExistingKeypair,
  signRSA,
} from "./crypto.ts";
import { Constants } from "@globals";
import { globals } from "@globals/globals";
import { encode as btoa } from "base-64";
import { Profile } from "@types";

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
  const userKeypair = existingUserKey ||
    (await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 512,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"],
    ));
  if (!existingUserKey) {
    await SecureStore.setItemAsync(
      Constants.SECURE_STORAGE_USER,
      btoa(JSON.stringify(userKeypair)),
    );
  }

  const deviceKeypair = existingDeviceKey ||
    (await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 512,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"],
    ));

  if (!existingDeviceKey) {
    await SecureStore.setItemAsync(
      Constants.SECURE_STORAGE_DEVICE,
      btoa(JSON.stringify(deviceKeypair)),
    );
  }

  const unsignedDevice = {
    id: null,
    name: username + "'s device",
    publicKey: btoa(await exportRSAKey(deviceKeypair.publicKey, "public")),
  };

  const deviceHash = await hash(JSON.stringify(unsignedDevice));
  const unsignedTX = {
    prevHash: null,
    type: "newUser",
    body: {
      id: null,
      username: username,
      name: name,
      // We'll handle bio & avatarHash post signup flow; the user can change these later in settings. Use defaults for now
      bio: "",
      avatarHash: Constants.DEFAULT_IPFS_HASH,
      publicKey: btoa(await exportRSAKey(userKeypair.publicKey, "public")),
      deviceHash: deviceHash,
      deviceSignature: await signRSA(deviceHash, deviceKeypair.privateKey),
      device: unsignedDevice,
    },
  };

  const signature = await signRSA(
    await hash(JSON.stringify(unsignedTX)),
    userKeypair.privateKey,
  );
  const request = {
    txHash: await hash(JSON.stringify(unsignedTX)),
    signature: signature,
    tx: unsignedTX,
  };

  try {
    const newUser: any = await post(
      Constants.PRISM_BASE_URL,
      "newUser",
      request,
    );
    if (
      newUser.username != username ||
      newUser.name != name ||
      newUser.userPublicKey !=
        btoa(await exportRSAKey(userKeypair.publicKey, "public")) ||
      newUser.clients[0].clientPublicKey !=
        btoa(await exportRSAKey(deviceKeypair.publicKey, "public")) ||
      newUser.clients[0].name != username + "'s device" ||
      newUser.clients.length > 1 ||
      newUser.chain.length > 1 ||
      newUser.chain[0].signature != signature ||
      newUser.avatarHash != Constants.DEFAULT_IPFS_HASH ||
      newUser.bio != "" || newUser.followers != 0 || newUser.following != 0
    ) {
      // WE DO NOT TRUST THE SERVER!!! If any user data it sends to use doesn't match our request, ignore EVERYTHING!
      // This definetly isn't 100% trustless yet, we need to integrate some more security using proofs. WE DO NOT TRUST THE SERVER!!
      return false;
    }
    // The same issue re: verifacation mentioned in profile.ts exists here.
    // https://github.com/PrismWeb3/Mobile/blob/d6e942f694efc9beb26fe87d4178a9327cb3f121/src/services/profile.ts#L64-L67
    const profile = {
      id: newUser._id,
      userPublicKey: newUser.userPublicKey,
      username: newUser.username,
      name: newUser.name,
      // These counts will, of course, always be 0 on account creation
      followers: 0,
      following: 0,
      bio: newUser.bio,
      image: Constants.IPFS_GATEWAY_URL + newUser.avatarHash,
      verified: newUser.verifed,
    } as Profile;
    await AsyncStorage.setItem(
      "loggedInUser",
      JSON.stringify(profile),
    );
    globals.loggedInUser = profile;
    return true;
  } catch (e) {
    return false;
  }
};
