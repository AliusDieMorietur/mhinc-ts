import { File, FileType } from "../types/file";
import { Id } from "../types/utils";
import { randomId } from "../utils/randomId";

export type FileStorageOptions = {};

export class FileStorage {
  private files: Record<Id, File>;
  constructor() {
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
