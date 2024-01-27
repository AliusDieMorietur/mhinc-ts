import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { LocalizationService } from "../lib/localizationService";
import { Language } from "../types/i18next";
import en from "../locales/en.json";
import ua from "../locales/ua.json";

export const STORAGE_KEY = "language";

const resources = {
  en,
  ua,
};

declare module "fastify" {
  interface FastifyInstance {
    localizationService: LocalizationService;
  }
}

const localizationServicePlugin = async (app: FastifyInstance): Promise<void> => {
  if (app.hasDecorator("localizationService")) return;
  const localizationService = new LocalizationService({
    defaultLanguage: Language.EN,
    resources,
  });
  await localizationService.start();
  app.decorate("localizationService", localizationService);
};

export default fp(localizationServicePlugin, {
  name: "LocalizationServicePlugin",
  dependencies: [],
});
