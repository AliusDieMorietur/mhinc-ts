import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { HttpServiceI } from "../types/http";
import { HttpService } from "../lib/httpService";

declare module "fastify" {
  interface FastifyInstance {
    http: HttpServiceI;
  }
}

const httpPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("http")) return;
  const http = new HttpService({
    defaultTimeout: 25000,
  });
  app.decorate("http", http);
};

export default fp(httpPlugin, {
  name: "HttpPlugin",
  dependencies: [],
});
