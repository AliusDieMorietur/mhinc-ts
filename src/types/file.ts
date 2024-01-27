import { Id } from "./utils";

export enum FileType {
  PHOTO = "photo",
  VIDEO = "video",
  ANIMATION = "animation",
}

export type File = {
  id: Id;
  fileId: string;
  type: FileType;
};
