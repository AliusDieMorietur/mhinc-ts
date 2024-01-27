import { createInstance, i18n } from "i18next";

export type Translation = Record<string, unknown>;

export type LocalizationServiceOptions = {
  defaultLanguage: string;
  resources: Record<
    string,
    {
      translation: Translation;
    }
  >;
};

export class LocalizationService {
  private defaultLanguage: LocalizationServiceOptions["defaultLanguage"];
  private resources: LocalizationServiceOptions["resources"];
  private i18next: i18n;
  constructor({ defaultLanguage, resources }: LocalizationServiceOptions) {
    this.i18next = createInstance();
    this.defaultLanguage = defaultLanguage;
    this.resources = resources;
  }

  async start() {
    this.i18next.init({
      lng: this.defaultLanguage,
      fallbackLng: this.defaultLanguage,
      interpolation: {
        escapeValue: false,
      },
      resources: this.resources,
    });
  }

  resolve(id: string, language: string | null, context: Record<string, unknown> = {}): string {
    const t = this.i18next.getFixedT(language ?? this.defaultLanguage);
    return t(id, context);
  }
}
