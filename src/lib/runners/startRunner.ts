import { Runner, RunnerMessage } from "../../types/runner";
import { Context } from "../../types/context";
import { Photo } from "../../types/telegram";
import EventEmitter from "node:events";
import { ActivityRouter } from "../activityRouter";
import { RunnerBase } from "./runnerBase";
import { TelegramChannel } from "../telegramChannel";
import { StateManager } from "../stateManager";

export type StartRunnerOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
};

export class StartRunner extends RunnerBase {
  constructor({
    activityRouter,
    stateManager,
    telegramChannel,
  }: StartRunnerOptions) {
    console.log("Start_RUNNER_CONSTRUCTOR");
    console.log("telegramChannel", telegramChannel);
    super({
      name: Runner.START,
      activityRouter,
      telegramChannel,
      stateManager,
    });
    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {
        const state = await this.stateManager.get(context.userId);
        console.log("state", state);
        const newState = state.state === "a" ? "b" : "a";
        const text = state.state === "a" ? "a" : "b";
        this.telegramChannel.sendMessage(
          context.telegramChatId,
          "message" + text
        );

        this.stateManager.create(context.userId, {
          runner: Runner.START,
          state: newState,
          data: { text },
        });
      },
      onStart: (context: Context, args: string[]) => {
        this.telegramChannel.sendMessage(
          context.telegramChatId,
          "This is start message"
        );
        this.stateManager.create(context.userId, {
          runner: Runner.START,
          state: "none",
          data: {},
        });
      },
    });
  }
}
