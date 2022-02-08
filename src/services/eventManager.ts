import { ActionSheetEvent } from "@types";
import { Subject } from "../utils";

class EventManager {
  public readonly authenticationSubject: Subject<boolean> = new Subject();

  public readonly actionSheet: Subject<ActionSheetEvent> = new Subject();

  public readonly profileUpdated: Subject<void> = new Subject();
}

export const eventManager = new EventManager();
