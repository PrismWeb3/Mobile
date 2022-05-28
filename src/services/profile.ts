import * as SecureStore from "expo-secure-store";
import { post } from "./helpers.ts";
import { hash, importExistingKeypair, signRSA } from "./crypto.ts";
import { Constants } from "@globals";
import { globals } from "@globals/globals";
// import { encode as btoa } from "base-64";
import { DatabaseUser } from "@types";
import { AsyncStorage } from "react-native";
import { Profile } from "@types";
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

    const editedProfile = {
      /*
      We trust the server here for metrics. Items like followers, following, & verified are not cryptographically verified using proofs
      I made this decision because I feel that metrics are less vital data, and don't need to be verified. Since following will require
      a signed tx, it is possible for clients to verify this data, but it'd be a lot of heavy lifting using the current model. Without
      a social graph I don't think this makes sense at this stage. I've addressed this issue in a few other comments throught the client
      but just to reiterate it here.

      The rest of the data is trustless (We already checked that the server returned us the correct username/name/bio/avatar)
      */

      id: globals.loggedInUser.id,
      userPublicKey: globals.loggedInUser.userPublicKey,
      username: resp.username,
      name: resp.name,
      followers: resp.followers,
      following: resp.following,
      bio: resp.bio,
      avatarHash: resp.avatarHash,
      imageURL: Constants.IPFS_GATEWAY_URL + resp.avatarHash,
      verified: resp.verifed,
    } as Profile;
    await AsyncStorage.setItem(
      "loggedInUser",
      JSON.stringify(editedProfile),
    );
    globals.loggedInUser = editedProfile;
    return true;
  } catch (e) {
    return false;
  }
};

export const uploadImage = async (image: Blob) => {
  console.log(image.type)
  const userKeyPair = importExistingKeypair(
    await SecureStore.getItemAsync(Constants.SECURE_STORAGE_USER),
  );
  // This should never happen, as the only way to open this screen is by having existing keys & being signed in
  if (!userKeyPair) {
    return false;
  }
  
  const unsignedContext = {
    id: globals.loggedInUser.id,
    timestamp: new Date().getUTCMilliseconds(),
    type: "avatar",
    userPublicKey: globals.loggedInUser.userPublicKey
  }
  
  const formdata = new FormData();
  formdata.append("image", image)
  formdata.append("context", JSON.stringify(unsignedContext))
  formdata.append("contextHash", await hash(JSON.stringify(unsignedContext)))
  formdata.append("signature", await signRSA(
    await hash(JSON.stringify(unsignedContext)),
    userKeyPair.privateKey,
  ))
  formdata.append("data", JSON.stringify(image))

  const res = await fetch("http://localhost:7621/uploadImage", {
    method: 'POST',
    body: formdata,
  })
  console.log(res.status)

}