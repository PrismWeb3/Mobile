import { Message } from "@types";

export const chatMessages: Message[] = [
  {
    text: "Hey Paul, Welcome to Prism!",
    time: new Date("Feb 12 20:53 22"),
    isSender: true,
  },
  {
    text: "This is awesome! Thanks for the invite. 🚀🚀",
    time: new Date("Feb 12 20:58 22"),
    isSender: false,
    reply: {
      text: "Hey Paul, Welcome to Prism!",
      time: new Date("Feb 12 20:53 22"),
      isSender: true,
    },
  },
];
