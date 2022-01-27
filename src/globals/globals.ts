import { WebView } from "react-native-webview";
import { Profile } from "@types";

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
    image: "",
    verified: false,
  },
};
