import { Command } from "../types/command";
import { Context } from "../types/context";
import { Photo } from "../types/telegram";
import EventEmitter from "node:events";
import { StateManager } from "./stateManager";

export type ActivityRouterOptions = {
  stateManager: StateManager;
};

export class ActivityRouter extends EventEmitter {
  private stateManager: ActivityRouterOptions["stateManager"];
  constructor({ stateManager }: ActivityRouterOptions) {
    super();
    this.stateManager = stateManager;
  }

  routeCommand(context: Context, command: string, args: string[]) {
    console.log("ROUTE_COMMAND");
    console.log("context", context);
    console.log("command", command);
    console.log("args", args);
    this.emit(`runner-start-${command}`, context, args);
  }

  async routeMessage(
    context: Context,
    message: {
      text: string;
      photo: Photo[];
    }
  ) {
    console.log("ROUTE_MESSAGE");
    console.log("context", context);
    console.log("message", message);
    const state = this.stateManager.get(context.userId);
    console.log("state", state);
    this.emit(`runner-message-${(await state).runner}`, context, message);
  }
}
