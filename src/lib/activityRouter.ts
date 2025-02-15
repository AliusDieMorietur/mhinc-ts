import { Command } from "../types/command";
import { Context } from "../types/context";
import { Photo } from "../types/telegram";
import EventEmitter from "node:events";
import { StateManager } from "./stateManager";
import { Runner } from "../types/runner";

export type ActivityRouterOptions = {
  stateManager: StateManager;
};

export class ActivityRouter extends EventEmitter {
  private stateManager: ActivityRouterOptions["stateManager"];
  constructor({ stateManager }: ActivityRouterOptions) {
    super();
    this.stateManager = stateManager;
  }

  route(context: Context, runner: Runner, args: string) {
    const emitted = this.emit(`runner-start-${runner}`, context, args);
    if (emitted) return;
    console.warn(`Failed to route to runner-start-${runner}`);
  }

  async routeMessage(
    context: Context,
    message: {
      text: string;
      photo: Photo[];
    },
  ) {
    try {
      const state = await this.stateManager.get(context.telegramChatId);
      const emitted = this.emit(`runner-message-${state.runner}`, context, message);
      if (emitted) return;
      console.warn(`Failed to route to runner-message-${state.runner}`);
    } catch (error) {
      console.log("error", error);
      this.emit(`runner-start-${Runner.START}`, context, message);
    }
  }
}
