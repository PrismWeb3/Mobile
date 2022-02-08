import * as SecureStore from "expo-secure-store";
import { post } from "./helpers.ts";
import { hash, importExistingKeypair, signRSA } from "./crypto.ts";
import { Constants } from "@globals";
import { globals } from "@globals/globals";
import { encode as btoa } from "base-64";
import { DatabaseUser } from "@types";
export const editProfile = async (
  name: string,
  username: string,
  bio: string,
  avatarHash: string,
) => {
  const userKeyPair = importExistingKeypair(
    await SecureStore.getItemAsync(Constants.SECURE_STORAGE_USER),
  );
  // This should never happen, as the only way to open this screen is by having existing keys & being signed in
  if (!userKeyPair) {
    return false;
  }
  const userData: DatabaseUser = await post(
    Constants.PRISM_BASE_URL,
    "getUser",
    {
      "id": globals.loggedInUser.id,
    },
  );
  if (!userData) return false;
  // Call getUser to get prevHash
  const unsignedTX = {
    prevHash: userData.chain[userData.chain.length - 1].txHash,
    type: "editUser",
    body: {
      id: globals.loggedInUser.id,
      username: globals.loggedInUser.username,
      userPublicKey: globals.loggedInUser.userPublicKey,
      newUserData: {
        username: username,
        name: name,
        bio: bio,
        avatarHash: avatarHash,
      },
    },
  };
  const request = {
    txHash: await hash(JSON.stringify(unsignedTX)),
    signature: await signRSA(
      await hash(JSON.stringify(unsignedTX)),
      userKeyPair.privateKey,
    ),
    tx: unsignedTX,
  };
  try {
    const resp: any = await post(Constants.PRISM_BASE_URL, "editUser", request);
    if (
      (resp.avatarHash != avatarHash) || (resp.username != username) ||
      (resp.name != name) || (resp.bio != bio)
    ) {
      // WE DO NOT TRUST THE SERVER!!! If any user data it sends to use doesn't match our request, ignore EVERYTHING!
      // This definetly isn't 100% trustless yet, we need to integrate some more security using proofs. WE DO NOT TRUST THE SERVER!!
      return false;
    }
    globals.loggedInUser = {
      // We really shouldn't update anything here besides what we asked for, but this can be addressed later. Like I said above, this
      // is a base implementation of editUser, and IS NOT TRUSTLESS YET! We still rely on the server's authority for some things rn
      // Some of the security concepts here are hard to build & need more thought before a final implementation. This is meant to serve
      // as a demo, not a final product re: server verifacation

      username: resp.username,
      name: resp.name,
      followers: resp.followers,
      following: resp.following,
      bio: resp.bio,
      image: resp.avatarHash, // WHEN IPFS: Constants.IPFS_GATEWAY_URL + resp.avatarHash,
      verified: resp.verifed,
    };
    return true;
  } catch (e) {
    console.log("ERROR EDITING PROFILE", e);
    return false;
  }
};
