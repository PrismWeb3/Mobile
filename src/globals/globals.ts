import { WebView } from "react-native-webview";
import { Profile } from "@types";
import { Constants } from "./constants.ts";
interface Globals {
  loggedInUser: Profile | undefined;
}

export const Webview = null;

export let globals: Globals = {
  loggedInUser: {
    username: "",
    name: "",
    followers: 0,
    following: 0,
    description: "",
    image: Constants.IPFS_GATEWAY_URL + Constants.DEFAULT_PROFILE_PICTURE,
    verified: false,
  },
};
