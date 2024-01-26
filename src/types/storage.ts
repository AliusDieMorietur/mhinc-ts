import { FileStorage } from "../storage/file";
import { UserStorage } from "../storage/user";

export type Storage = {
  user: UserStorage;
  file: FileStorage;
};
