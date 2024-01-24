import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { FileStorage } from "../lib/fileStorage";

declare module "fastify" {
  interface FastifyInstance {
    fileStorage: FileStorage;
  }
}

const fileStoragePlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("fileStorage")) return;
  const fileStorage = new FileStorage({});
  app.decorate("fileStorage", fileStorage);
};

export default fp(fileStoragePlugin, {
  name: "FileStoragePlugin",
  dependencies: [],
});
