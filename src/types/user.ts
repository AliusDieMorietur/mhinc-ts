import { Language } from "./i18next";
import { ChatId } from "./telegram";
import { Id } from "./utils";

export type User = {
  id: Id;
  name: string;
  telegramChatId: ChatId;
  language: Language;
};

export type UserBase = Omit<User, "id">;
