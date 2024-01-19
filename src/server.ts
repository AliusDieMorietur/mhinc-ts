import { default as fastifyAutoload } from "@fastify/autoload";
import fastifyHelmet from "@fastify/helmet";
import fastifySensible from "@fastify/sensible";
import cors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { join } from "path";
import pino from "pino";

import { ServiceEnv } from "./lib/env.js";

export const serverPlugin = fp(async (server) => {
  await server.register(fastifySensible);
  await server.register(fastifyHelmet);
  await server.register(cors);
  await server.register(fastifyAutoload, {
    dir: join(__dirname, "plugins"),
  });
  await server.register(fastifyAutoload, {
    dir: join(__dirname, "routes"),
  });
});

const defaultLogLevel = process.env.ENV === ServiceEnv.LOCAL ? "debug" : "info";

export const buildServer = async (): Promise<FastifyInstance> => {
  const server = fastify({
    // http2: true,
    // https: {
    //   allowHTTP1: true,
    // },
    pluginTimeout: 25_000,
    logger: pino({
      level: process.env.LOG_LEVEL ?? defaultLogLevel,
    }),
  }) as unknown as FastifyInstance;

  void server.register(serverPlugin);

  await server.ready().then(null, (err: unknown) => {
    server.log.error({ err }, "Server failed to setup");
    throw err;
  });

  return server;
};
