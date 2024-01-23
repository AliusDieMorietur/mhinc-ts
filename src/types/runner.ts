import { Photo } from "./telegram";

export enum Runner {
  START = "start",
  ECHO = "echo",
}

export type RunnerMessage = {
  text: string;
  photo: Photo[];
};

export type State = {
  runner: Runner;
  state: string;
  data: Record<string, unknown>;
};
