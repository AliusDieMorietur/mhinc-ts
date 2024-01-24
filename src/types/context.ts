import { User } from "./user";

export type Context = {
  userId: User["id"];
  telegramChatId: User["telegramChatId"];
  name: string;
} & Record<string, unknown>;
