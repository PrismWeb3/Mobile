import { Profile } from "@types";
import { Constants } from "./constants.ts";
interface Globals {
  loggedInUser: Profile | undefined;
}

export const Webview = null;

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
    image: Constants.IPFS_GATEWAY_URL + Constants.DEFAULT_PROFILE_PICTURE,
    verified: false,
  },
};
// This should get stored in local storage & pulled in on app load
