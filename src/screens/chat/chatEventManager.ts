import { ChatMediaModalEvent, Message } from "@types";
import { Subject } from "../../utils";

export class ChatEventManager {
  public readonly newMessage: Subject<Message> = new Subject();

  public readonly reply: Subject<Message> = new Subject();

  public readonly mediaModal: Subject<ChatMediaModalEvent> = new Subject();
}

export const chatEventManager = new ChatEventManager();
