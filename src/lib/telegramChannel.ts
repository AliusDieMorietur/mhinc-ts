import { ChatId, InlineMarkup, Photo, ReplyMarkup } from "../types/telegram";
import { ServiceError } from "../types/error";
import { HttpServiceI } from "../types/http";

export type TelegramChannelOptions = {
  serverUrl: string;
  apiUrl: string;
  token: string;
  http: HttpServiceI;
};

export class TelegramChannel {
  private serverUrl: TelegramChannelOptions["serverUrl"];
  private http: TelegramChannelOptions["http"];
  private apiUrl: TelegramChannelOptions["apiUrl"];
  private token: TelegramChannelOptions["token"];

  constructor({ serverUrl, http, apiUrl, token }: TelegramChannelOptions) {
    this.http = http;
    this.serverUrl = serverUrl;
    this.apiUrl = apiUrl;
    this.token = token;
  }

  async start() {
    if (!this.serverUrl) {
      throw new ServiceError("Server url is required");
    }
    console.log(
      "WEBHOOK_URL",
      `${this.apiUrl}${this.token}/setWebhook?url=${this.serverUrl}/telegram/webhook`,
    );
    const response = await this.http.requestJson(
      `${this.apiUrl}${this.token}/setWebhook?url=${this.serverUrl}/telegram/webhook`,
      { method: "GET" },
    );

    console.log("response", response);
  }

  async sendMessage(chatId: ChatId, text: string, replyMarkup?: InlineMarkup | ReplyMarkup) {
    const url = `${this.apiUrl}${this.token}/sendMessage`;

    await this.http.requestJson(url, {
      method: "POST",
      body: { text, chat_id: chatId, reply_markup: replyMarkup || {} },
    });
  }

  async sendPhoto(
    chatId: ChatId,
    fileId: string,
    replyMarkup?: InlineMarkup | ReplyMarkup,
    caption = "",
  ) {
    const url = `${this.apiUrl}${this.token}/sendPhoto`;
    await this.http.requestJson(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        photo: fileId,
        caption,
        reply_markup: replyMarkup || {},
      },
    });
  }

  async sendVideo(
    chatId: ChatId,
    fileId: string,
    replyMarkup?: InlineMarkup | ReplyMarkup,
    caption = "",
  ) {
    const url = `${this.apiUrl}${this.token}/sendVideo`;
    await this.http.requestJson(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        video: fileId,
        caption,
        reply_markup: replyMarkup || {},
      },
    });
  }

  async sendAnimation(
    chatId: ChatId,
    fileId: string,
    replyMarkup?: InlineMarkup | ReplyMarkup,
    caption = "",
  ) {
    const url = `${this.apiUrl}${this.token}/sendAnimation`;
    await this.http.requestJson(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        animation: fileId,
        caption,
        reply_markup: replyMarkup || {},
      },
    });
  }

  async sendMediaGroup(photos: Photo[], chatId: ChatId, caption: string) {
    const media = photos.map(({ file_unique_id }) => ({
      type: "photo",
      media: file_unique_id,
    }));

    const url = `${this.apiUrl}${this.token}/sendMediaGroup`;
    await this.http.requestJson(url, {
      method: "POST",
      body: {
        chat_id: chatId,
        media,
        caption,
      },
    });
  }

  async answerCallback(id: string) {
    const url = `${this.apiUrl}${this.token}/answerCallbackQuery`;
    await this.http.requestJson(url, {
      method: "POST",
      body: {
        callback_query_id: id,
      },
    });
  }
}
