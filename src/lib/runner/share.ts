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
  YES = "Yes",
  NO = "No",
}

export type ShareRunnerOptions = {} & Omit<RunnerBaseExtendedOptions, "name">;

export class ShareRunner extends RunnerBaseExtended {
  constructor(options: ShareRunnerOptions) {
    super({
      name: Runner.SHARE,
      ...options,
    });
    const states: Record<string, MessageHandler> = {
      [ShareRunnerState.CONFIDENTIALITY]: async (context, message) => {
        const user = await this.storage.user.getByChatId(context.telegramChatId);
        const buttonOptions = Object.fromEntries(
          Object.values(ConfidentialityReply).map((reply) => [
            this.localizationService.resolve(`button.${reply}`, user.language),
            reply,
          ]),
        );
        if (buttonOptions[message.text]) {
          this.stateManager.create(context.telegramChatId, {
            runner: Runner.SHARE,
            state: ShareRunnerState.SHARE,
            data: {
              anonymous: buttonOptions[message.text] === ConfidentialityReply.YES,
            },
          });
          states[ShareRunnerState.SHARE](context, message);
          return;
        }
        this.askConfidentiality(context);
      },
      [ShareRunnerState.SHARE]: async (context, message) => {
        const state = await this.stateManager.get(context.telegramChatId);
        const user = await this.storage.user.getByChatId(context.telegramChatId);
        if (!message.video && message.photo.length === 0 && !message.animation) {
          this.telegramChannel.sendMessage(
            context.telegramChatId,
            this.localizationService.resolve("label.NowYouCanSendPhotosOrVideos", user.language),
          );
          return;
        }
        const caption = (() => {
          let caption = "";
          if (!state.data.anonymous) {
            caption += "@" + user.name;
          }
          if (message.text) {
            caption += message.text;
          }
          return caption;
        })();
        if (message.video) {
          const fileId = message.video.file_id;
          this.sendVideo(context, fileId, caption);
        }
        if (message.photo.length > 0) {
          const fileId = message.photo.at(-1)!.file_id;
          this.sendPhoto(context, fileId, caption);
        }
        if (message.animation) {
          const fileId = message.animation.file_id;
          this.sendAnimation(context, fileId, caption);
        }
        if (
          message.mediaGroupId !== state.data.mediaGroupId ||
          (!state.data.mediaGroupId && !message.mediaGroupId)
        ) {
          this.telegramChannel.sendMessage(
            context.telegramChatId,
            this.localizationService.resolve("label.Sent", user.language),
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
      onStart: async (context: Context, _: string) => {
        this.askConfidentiality(context);
      },
    });
  }

  async askConfidentiality(context: Context) {
    const user = await this.storage.user.getByChatId(context.telegramChatId);
    const replyMarkup = {
      one_time_keyboard: true,
      keyboard: [
        [
          {
            text: this.localizationService.resolve("button.Yes", user.language),
          },
        ],
        [
          {
            text: this.localizationService.resolve("button.No", user.language),
          },
        ],
      ],
    };
    const text = this.localizationService.resolve("label.DoYouWantToStayAnonymous", user.language);
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
            text: this.localizationService.resolve("button.Approve", user.language),
            callback_data: `/moderation approve ${id} ${context.telegramChatId} ${caption}`,
          },
          {
            text: this.localizationService.resolve("button.Reject", user.language),
            callback_data: `/moderation reject ${id} ${context.telegramChatId} ${caption}`,
          },
        ],
      ],
    };
    this.telegramChannel.sendVideo(ADMIN_ID, fileId, replyMarkup, caption);
  }

  async sendPhoto(context: Context, fileId: string, caption = "") {
    const user = await this.storage.user.getByChatId(context.telegramChatId);
    const id = await this.storage.file.upload(fileId, FileType.PHOTO);
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: this.localizationService.resolve("button.Approve", user.language),
            callback_data: `/moderation approve ${id} ${context.telegramChatId} ${caption}`,
          },
          {
            text: this.localizationService.resolve("button.Reject", user.language),
            callback_data: `/moderation reject ${id} ${context.telegramChatId} ${caption}`,
          },
        ],
      ],
    };
    this.telegramChannel.sendPhoto(ADMIN_ID, fileId, replyMarkup, caption);
  }

  async sendAnimation(context: Context, fileId: string, caption = "") {
    const user = await this.storage.user.getByChatId(context.telegramChatId);
    const id = await this.storage.file.upload(fileId, FileType.ANIMATION);
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: this.localizationService.resolve("button.Approve", user.language),
            callback_data: `/moderation approve ${id} ${context.telegramChatId} ${caption}`,
          },
          {
            text: this.localizationService.resolve("button.Reject", user.language),
            callback_data: `/moderation reject ${id} ${context.telegramChatId} ${caption}`,
          },
        ],
      ],
    };
    this.telegramChannel.sendAnimation(ADMIN_ID, fileId, replyMarkup, caption);
  }
}
