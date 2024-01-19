import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.get("/ping", {}, async () => {
    return "pong";
  });
}
