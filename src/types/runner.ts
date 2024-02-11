import { Animation, Photo, Video } from "./telegram";

export enum Runner {
  START = "start",
  ECHO = "echo",
  UNHANDLED = "unhandled",
  MODERATION = "moderation",
  MENU = "menu",
  SHARE = "share",
  HELP = "help",
}

export type RunnerMessage = {
  text: string;
  photo: Photo[];
  video?: Video;
  mediaGroupId?: string;
  animation?: Animation;
};

export type State = {
  runner: Runner;
  state: string;
  data: Record<string, unknown>;
};
