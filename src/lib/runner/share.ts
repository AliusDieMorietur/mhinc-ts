import { ADMIN_ID } from "../../consts";
import { Context } from "../../types/context";
import { FileType } from "../../types/file";
import { Runner, RunnerMessage } from "../../types/runner";
import { MessageHandler } from "./base";
import { RunnerBaseExtended, RunnerBaseExtendedOptions } from "./baseExtended";

export enum ShareRunnerState {
  CONFIDENTIALITY = "confidentiality",
  SHARE = "share",
}

export enum ConfidentialityReply {
  YES = "yes",
  NO = "no",
}

export type ShareRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class ShareRunner extends RunnerBaseExtended {
  constructor(options: ShareRunnerOptions) {
    console.log("Share_RUNNER_CONSTRUCTOR");
    super({
      name: Runner.SHARE,
      ...options,
    });
    const states: Record<string, MessageHandler> = {
      [ShareRunnerState.CONFIDENTIALITY]: async (context, message) => {
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        const buttonOptions = Object.values(ConfidentialityReply) as string[];
        if (buttonOptions.includes(message.text)) {
          this.stateManager.create(context.telegramChatId, {
            runner: Runner.SHARE,
            state: ShareRunnerState.SHARE,
            data: {
              anonymous: message.text === ConfidentialityReply.YES,
            },
          });
          states[ShareRunnerState.SHARE](context, message);
          return;
        }
        this.askConfidentiality(context);
      },
      [ShareRunnerState.SHARE]: async (context, message) => {
        const state = await this.stateManager.get(context.telegramChatId);
        const user = await this.storage.user.getByChatId(
          context.telegramChatId
        );
        console.log("SHARE");
        console.log("user", user);
        console.log("message", message);
        console.log("state", state);
        if (!message.video && message.photo.length === 0) {
          this.telegramChannel.sendMessage(
            context.telegramChatId,
            this.localizationService.resolve(
              "label.NowYouCanSendPhotosOrVideos",
              user.language
            )
          );
          return;
        }

        const caption = state.data.anonymous ? "" : "@" + user.name;

        if (message.video) {
          const fileId = message.video.file_id;
          this.sendVideo(context, fileId, caption);
        }
        if (message.photo.length > 0) {
          const fileId = message.photo.at(-1)!.file_id;
          this.sendPhoto(context, fileId, caption);
        }
        if (
          message.mediaGroupId !== state.data.mediaGroupId ||
          (!state.data.mediaGroupId && !message.mediaGroupId)
        ) {
          this.telegramChannel.sendMessage(
            context.telegramChatId,
            this.localizationService.resolve("label.Sent", user.language)
          );
        }
        this.stateManager.create(context.telegramChatId, {
          runner: Runner.SHARE,
          state: ShareRunnerState.SHARE,
          data: {
            mediaGroupId: message.mediaGroupId,
          },
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
        this.askConfidentiality(context);
      },
    });
  }

  async askConfidentiality(context: Context) {
    const user = await this.storage.user.getByChatId(context.telegramChatId);
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: this.localizationService.resolve("button.Yes", user.language),
            callback_data: ConfidentialityReply.YES,
          },
          {
            text: this.localizationService.resolve("button.No", user.language),
            callback_data: ConfidentialityReply.NO,
          },
        ],
      ],
    };
    const text = this.localizationService.resolve(
      "label.DoYouWantToStayAnonymous",
      user.language
    );
    this.telegramChannel.sendMessage(context.telegramChatId, text, replyMarkup);
    this.stateManager.create(context.telegramChatId, {
      runner: Runner.SHARE,
      state: ShareRunnerState.CONFIDENTIALITY,
      data: {},
    });
  }

  async sendVideo(context: Context, fileId: string, caption = "") {
    const user = await this.storage.user.getByChatId(ADMIN_ID);
    const id = await this.storage.file.upload(fileId, FileType.VIDEO);
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: this.localizationService.resolve(
              "button.Approve",
              user.language
            ),
            callback_data: `/moderation approve ${id} ${context.telegramChatId} ${caption}`,
          },
          {
            text: this.localizationService.resolve(
              "button.Reject",
              user.language
            ),
            callback_data: `/moderation reject ${id} ${context.telegramChatId} ${caption}`,
          },
        ],
      ],
    };
    console.log("context.username", context.username);
    this.telegramChannel.sendVideo(ADMIN_ID, fileId, replyMarkup, caption);
  }

  async sendPhoto(context: Context, fileId: string, caption = "") {
    const user = await this.storage.user.getByChatId(context.telegramChatId);
    const id = await this.storage.file.upload(fileId, FileType.PHOTO);
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: this.localizationService.resolve(
              "button.Approve",
              user.language
            ),
            callback_data: `/moderation approve ${id} ${context.telegramChatId} ${caption}`,
          },
          {
            text: this.localizationService.resolve(
              "button.Reject",
              user.language
            ),
            callback_data: `/moderation reject ${id} ${context.telegramChatId} ${caption}`,
          },
        ],
      ],
    };
    console.log("context.username", context.username);
    this.telegramChannel.sendPhoto(ADMIN_ID, fileId, replyMarkup, caption);
  }
}
