import { FastifyInstance } from "fastify";

import { buildServer } from "./server.js";

/* eslint-disable no-console */

let server: FastifyInstance | null = null;

process.on("unhandledRejection", (err) => {
  if (server?.log) {
    server?.log?.fatal({ err }, "Server failed with unhandled rejection");
  } else {
    console.error({ err }, "Server failed with unhandled rejection");
  }
  process.exit(1);
});

(async () => {
  try {
    server = await buildServer();
    await server.listen({ port: 3008, host: "127.0.0.1" });
    server.log.info({ port: 3008 }, "Server is listening");
  } catch (err: unknown) {
    (server?.log ?? console).error({ err }, "Server setup failed");
    process.exit(1);
  }
})().then(console.log, console.error);
