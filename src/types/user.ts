import { ChatId } from "./telegram";
import { Id } from "./utils";

export type User = {
  id: Id;
  name: string;
  telegramChatId: ChatId;
};

export type UserBase = Omit<User, "id">;
