import { Message } from "@types";

export const chatMessages: Message[] = [
  {
    text: "Hey man! Welcome to Prism. Here's a test message :)",
    time: new Date("December 25 2:32 pm"),
    isSender: true,
  },
  {
    text: "Awesome! Thanks for the invite.",
    time: new Date("December 25 2:35 pm"),
    isSender: false,
    reply: {
      text: "Hey man! Welcome to Prism. Here's a test message :)",
      time: new Date("December 26 8:57 am"),
      isSender: true,
    },
  },
  {
    text: "🚀🚀",
    time: new Date("December 25 2:35 pm"),
    isSender: false,
  },
];
