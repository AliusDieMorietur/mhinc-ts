export type TelegramUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
};

export type ChatId = number;

export type Chat = {
  id: ChatId;
  type: string;
  title?: string;
  username: string;
  first_name?: string;
  last_name?: string;
};

export type Photo = {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size: number;
};

export type Video = {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  file_size?: number;
};

export type Animation = {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  file_size?: number;
};

export type InlineKeyboardButton = {
  text: string;
  callback_data?: string;
  url?: string;
};

export type InlineMarkup = {
  inline_keyboard: InlineKeyboardButton[][];
};

export type ReplyKeyboardButton = {
  text: string;
};

export type ReplyMarkup = {
  keyboard: ReplyKeyboardButton[][];
  one_time_keyboard?: boolean;
};

export type PhotoPayload = {
  photo?: string;
  chat_id?: ChatId;
  caption?: string;
  reply_markup?: InlineMarkup;
};

export type InputMediaPhoto = {
  type?: string;
  media?: string;
};

export type MediaGroupPayload = {
  chat_id: ChatId;
  media?: InputMediaPhoto[];
  caption?: string;
};

export type From = {
  id: ChatId;
  first_name?: string;
  username?: string;
};

export type Message = {
  message_id: number;
  message_thread_id: number;
  text?: string;
  from: From;
  chat: Chat;
  sender_chat?: Chat;
  date: number;
  photo?: Photo[];
  media_group_id?: string;
  video?: Video;
  animation?: Animation;
  caption?: string;
};

export type CallbackQuery = {
  id: string;
  from: TelegramUser;
  message?: Message;
  data: string;
};

export type Update = {
  from: any;
  update_id: number;
  message?: Message;
  callback_query?: CallbackQuery;
};
