import { Command } from "../types/command";
import { Context } from "../types/context";
import { Photo } from "../types/telegram";
import EventEmitter from "node:events";
import { StateManager } from "./stateManager";
import { Runner } from "../types/runner";
import { Id } from "../types/utils";
import { randomId } from "../utils/randomId";

export enum FileType {
  PHOTO = "photo",
  VIDEO = "video",
}

export type File = {
  id: Id;
  fileId: string;
  type: FileType;
};

export type FileStorageOptions = {};

export class FileStorage {
  private files: Record<Id, File>;
  constructor({}: FileStorageOptions) {
    this.files = {};
  }

  async upload(fileId: string, type: FileType) {
    const id = randomId();
    this.files[id] = {
      id,
      fileId,
      type,
    };
    return id;
  }

  async get(id: string) {
    return this.files[id];
  }
}
