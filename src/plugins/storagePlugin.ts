import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UserStorage } from "../storage/user";
import { FileStorage } from "../storage/file";
import { Storage } from "../types/storage";
import { ADMIN_ID } from "../consts";
import { Language } from "../types/i18next";

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }
}

const storagePlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("storage")) return;
  const user = new UserStorage();
  await user.create({
    name: "DimensionalReverse",
    telegramChatId: ADMIN_ID,
    language: Language.UA,
  });
  app.decorate("storage", {
    user,
    file: new FileStorage(),
  });
};

export default fp(storagePlugin, {
  name: "StoragePlugin",
  dependencies: [],
});
