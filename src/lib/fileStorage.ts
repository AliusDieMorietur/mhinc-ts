import { Command } from "../types/command";
import { Context } from "../types/context";
import { Photo } from "../types/telegram";
import EventEmitter from "node:events";
import { StateManager } from "./stateManager";
import { Runner } from "../types/runner";
import { Id } from "../types/utils";
import { randomId } from "../utils/randomId";

export type FileStorageOptions = {};

export class FileStorage {
  private files: Record<
    Id,
    {
      id: Id;
      fileId: string;
    }
  >;
  constructor({}: FileStorageOptions) {
    this.files = {};
  }

  async upload(fileId: string) {
    const id = randomId();
    this.files[id] = {
      fileId,
      id,
    };
    return id;
  }

  async get(id: string) {
    return this.files[id];
  }
}
