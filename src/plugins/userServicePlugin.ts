import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UserService } from "../lib/userService";

declare module "fastify" {
  interface FastifyInstance {
    userService: UserService;
  }
}

const userPlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("userService")) return;
  const userService = new UserService();
  await userService.create({
    name: "test",
  });
  app.decorate("userService", userService);
};

export default fp(userPlugin, {
  name: "UserServicePlugin",
  dependencies: [],
});
