import { Context } from "../../types/context";
import { RunnerMessage } from "../../types/runner";
import { ActivityRouter } from "../activityRouter";
import { FileStorage } from "../fileStorage";
import { StateManager } from "../stateManager";
import { TelegramChannel } from "../telegramChannel";

export type RunnerBaseOptions = {
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
  name: string;
};

export class RunnerBase {
  public activityRouter: RunnerBaseOptions["activityRouter"];
  public telegramChannel: RunnerBaseOptions["telegramChannel"];
  public stateManager: RunnerBaseOptions["stateManager"];
  public name: string;
  public startEvent: string;
  public messageEvent: string;
  constructor({
    name,
    activityRouter,
    stateManager,
    telegramChannel,
  }: RunnerBaseOptions) {
    this.name = name;
    this.activityRouter = activityRouter;
    this.telegramChannel = telegramChannel;
    this.stateManager = stateManager;
    this.startEvent = `runner-start-${name}`;
    this.messageEvent = `runner-message-${name}`;
  }

  init({
    onStart,
    onMessage,
  }: {
    onStart: (context: Context, args: string[]) => void;
    onMessage: (context: Context, message: RunnerMessage) => void;
  }) {
    this.activityRouter.on(this.startEvent, onStart);
    this.activityRouter.on(this.messageEvent, onMessage);
  }
}
