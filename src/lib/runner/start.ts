import { Context } from "../../types/context";
import { Language } from "../../types/i18next";
import { Runner, RunnerMessage } from "../../types/runner";
import { MessageHandler } from "./base";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export enum StartRunnerState {
  CHOOSE_LANGUAGE = "chooseLanguage",
  GREETINGS = "greetings",
}

export type StartRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class StartRunner extends RunnerBaseExtended {
  constructor(options: StartRunnerOptions) {
    super({
      name: Runner.START,
      ...options,
    });

    const states: Record<string, MessageHandler> = {
      [StartRunnerState.CHOOSE_LANGUAGE]: async (context, message) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId).catch(() => null);
        const allowedLanguages = Object.fromEntries(
          Object.values(Language).map((language) => [
            this.localizationService.resolve(`button.${language}`, user?.language ?? null),
            language,
          ]),
        );
        if (allowedLanguages[message.text] && user) {
          await this.storage.user.update(user.id, {
            language: allowedLanguages[message.text],
          });
          this.activityRouter.route(context, Runner.MENU, "");
          return;
        }
        const replyMarkup = {
          keyboard: [
            Object.keys(allowedLanguages).map((language) => ({
              text: language,
            })),
          ],
        };
        const text = this.localizationService.resolve(
          "label.ChooseLanguage",
          user?.language ?? null,
        );
        this.telegramChannel.sendMessage(context.telegramChatId, text, replyMarkup);
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.START,
          state: StartRunnerState.CHOOSE_LANGUAGE,
          data: {},
        });
      },
      [StartRunnerState.GREETINGS]: async (context, message) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId).catch(() => null);
        const text = this.localizationService.resolve("label.Start", user?.language ?? null);
        const startText = this.localizationService.resolve("button.Start", user?.language ?? null);
        const shareText = this.localizationService.resolve("button.Share", user?.language ?? null);
        const helpText = this.localizationService.resolve("button.Help", user?.language ?? null);
        const textToRunner: Record<string, Runner> = {
          [startText]: Runner.START,
          [shareText]: Runner.SHARE,
          [helpText]: Runner.HELP,
        };
        const runner = textToRunner[message.text];
        if (runner) {
          this.activityRouter.route(context, runner, "");
          return;
        }
        this.telegramChannel.sendMessage(context.telegramChatId, text, {
          keyboard: [
            [{ text: this.localizationService.resolve("button.Start", user?.language ?? null) }],
            [{ text: this.localizationService.resolve("button.Share", user?.language ?? null) }],
            [{ text: this.localizationService.resolve("button.Help", user?.language ?? null) }],
          ],
        });
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.START,
          state: StartRunnerState.GREETINGS,
          data: {},
        });
      },
    };

    this.init({
      onMessage: async (context: Context, message: RunnerMessage) => {
        const state = await this.stateManager.get(context.telegramChatId);
        const handler = states[state.state];
        if (handler) handler(context, message);
      },
      onStart: async (context: Context, _: string) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId).catch(() => null);
        const text = this.localizationService.resolve(
          "label.ChooseLanguage",
          user?.language ?? null,
        );
        const allowedLanguages = Object.values(Language).map((language) =>
          this.localizationService.resolve(`button.${language}`, user?.language ?? null),
        );
        const replyMarkup = {
          keyboard: allowedLanguages.map((language) => [
            {
              text: language,
            },
          ]),
        };
        this.telegramChannel.sendMessage(context.telegramChatId, text, replyMarkup);
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.START,
          state: StartRunnerState.CHOOSE_LANGUAGE,
          data: {},
        });
      },
    });
  }
}
