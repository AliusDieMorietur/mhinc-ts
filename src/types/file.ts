import { Id } from "./utils";

export enum FileType {
  PHOTO = "photo",
  VIDEO = "video",
}

export type File = {
  id: Id;
  fileId: string;
  type: FileType;
};
