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
    console.log("Start_RUNNER_CONSTRUCTOR");
    super({
      name: Runner.START,
      ...options,
    });

    const states: Record<string, MessageHandler> = {
      [StartRunnerState.CHOOSE_LANGUAGE]: async (context, message) => {
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        const allowedLanguages = Object.values(Language) as string[];
        console.log("allowedLanguages", allowedLanguages);
        console.log("message.text", message.text);
        if (allowedLanguages.includes(message.text)) {
          await this.storage.user.update(user.id, {
            language: message.text as Language,
          });
          this.stateManager.create(context.telegramChatId, {
            runner: Runner.START,
            state: StartRunnerState.CHOOSE_LANGUAGE,
            data: {},
          });
          states[StartRunnerState.GREETINGS](context, message);
          return;
        }
        const replyMarkup = {
          inline_keyboard: [
            allowedLanguages.map((language) => ({
              text: language,
              callback_data: language,
            })),
          ],
        };
        const text = this.localizationService.resolve(
          "label.ChooseLanguage",
          user.language
        );
        this.telegramChannel.sendMessage(
          context.telegramChatId,
          text,
          replyMarkup
        );
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.START,
          state: StartRunnerState.CHOOSE_LANGUAGE,
          data: {},
        });
      },
      [StartRunnerState.GREETINGS]: async (context, message) => {
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        const text = this.localizationService.resolve(
          "label.Start",
          user.language
        );
        this.telegramChannel.sendMessage(context.telegramChatId, text);
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
      onStart: async (context: Context, args: string[]) => {
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        const text = this.localizationService.resolve(
          "label.ChooseLanguage",
          user.language
        );
        const allowedLanguages = Object.values(Language);
        const replyMarkup = {
          inline_keyboard: [
            allowedLanguages.map((language) => ({
              text: language,
              callback_data: language,
            })),
          ],
        };
        this.telegramChannel.sendMessage(
          context.telegramChatId,
          text,
          replyMarkup
        );
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.START,
          state: StartRunnerState.CHOOSE_LANGUAGE,
          data: {},
        });
      },
    });
  }
}
