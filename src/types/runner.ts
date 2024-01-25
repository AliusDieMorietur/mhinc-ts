import { Photo, Video } from "./telegram";

export enum Runner {
  START = "start",
  ECHO = "echo",
  UNHANDLED = "unhandled",
  MODERATION = "moderation",
  SHARE = "share",
}

export type RunnerMessage = {
  text: string;
  photo: Photo[];
  video?: Video;
  mediaGroupId?: string;
};

export type State = {
  runner: Runner;
  state: string;
  data: Record<string, unknown>;
};
