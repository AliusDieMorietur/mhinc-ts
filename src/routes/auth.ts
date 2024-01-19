import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance): Promise<void> {
  app.post<{
    Body: {};
    Reply: string;
  }>("/login", {}, async () => {
    return "1234";
  });

  app.get<{
    Reply: string;
  }>("/test", {}, async () => {
    return "1234";
  });
}
