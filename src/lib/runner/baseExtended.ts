import { Context } from "../../types/context";
import { RunnerMessage } from "../../types/runner";
import { ActivityRouter } from "../activityRouter";
import { FileStorage } from "../../storage/file";
import { StateManager } from "../stateManager";
import { TelegramChannel } from "../telegramChannel";
import { RunnerBase } from "./base";
import { LocalizationService } from "../localizationService";
import { Storage } from "../../types/storage";

export type RunnerBaseExtendedOptions = {
  name: string;
  activityRouter: ActivityRouter;
  telegramChannel: TelegramChannel;
  stateManager: StateManager;
  localizationService: LocalizationService;
  storage: Storage;
};

export class RunnerBaseExtended extends RunnerBase {
  public localizationService: RunnerBaseExtendedOptions["localizationService"];
  public storage: RunnerBaseExtendedOptions["storage"];
  constructor({ localizationService, storage, ...baseOptions }: RunnerBaseExtendedOptions) {
    super(baseOptions);
    this.storage = storage;
    this.localizationService = localizationService;
  }
}
