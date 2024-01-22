export type ChatId = string | number;

export type Chat = {
  id: ChatId;
};

export type From = {
  id: ChatId;
};

export type Message = {
  text: string;
  from: From;
  chat: Chat;
};

export type Update = {
  message: Message;
};
