import { Profile } from "@types";
import { Constants } from "./constants.ts";
interface Globals {
  loggedInUser: Profile | undefined;
}

// globals is altered, just not in this file. It cannot be a const.
// deno-lint-ignore prefer-const
export let globals: Globals = {
  loggedInUser: {
    id: "",
    userPublicKey: "",
    username: "",
    name: "",
    followers: 0,
    following: 0,
    bio: "",
    avatarHash: Constants.DEFAULT_IPFS_HASH,
    imageURL: Constants.IPFS_GATEWAY_URL + Constants.DEFAULT_IPFS_HASH,
    verified: false,
  },
};
