import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.get("/", { logLevel: "silent" }, async (request, reply) => {
    void reply.status(404).send({
      message: "Route GET:/ found",
      error: "Not Found",
      statusCode: 404,
    });
  });
}
