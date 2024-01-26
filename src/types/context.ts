import { ChatId } from "./telegram";

export type Context = {
  telegramChatId: ChatId;
} & Record<string, unknown>;
