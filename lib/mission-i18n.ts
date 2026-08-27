import fs from "fs";
import path from "path";

type Locale = "fr" | "en";

const translationsCache = new Map<string, Record<string, unknown>>();

function loadTranslations(locale: Locale): Record<string, unknown> {
  if (translationsCache.has(locale)) {
    return translationsCache.get(locale)!;
  }

  const filePath = path.join(process.cwd(), "locales", locale, "missions.json");
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const translations = JSON.parse(content);
    translationsCache.set(locale, translations);
    return translations;
  } catch {
    // Fallback to French if locale not found
    if (locale !== "fr") {
      return loadTranslations("fr");
    }
    return {};
  }
}

export function t(key: string, locale: Locale = "fr", params?: Record<string, string | number>): string {
  const translations = loadTranslations(locale);
  const keys = key.split(".");
  let value: unknown = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  let result = typeof value === "string" ? value : key;

  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      result = result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"), String(paramValue));
    }
  }

  return result;
}

export function getLocaleFromRequest(request: Request): Locale {
  const acceptLanguage = request.headers.get("accept-language") || "";
  if (acceptLanguage.startsWith("en")) return "en";
  return "fr";
}

export function getAvailableLocales(): Locale[] {
  return ["fr", "en"];
}

export function getMissionLocales(): Record<Locale, string> {
  return { fr: "Français", en: "English" };
}

export function getMissionCategoryLabel(category: string, locale: Locale = "fr"): string {
  return t(`mission.categories.${category}`, locale) || category;
}

export function getMissionLevelLabel(level: string, locale: Locale = "fr"): string {
  return t(`mission.missionLevels.${level}`, locale) || level;
}

export function getMissionStatusLabel(status: string, locale: Locale = "fr"): string {
  return t(`mission.statuses.${status}`, locale) || status;
}

export function getSubmissionMethodLabel(method: string, locale: Locale = "fr"): string {
  return t(`mission.submissionMethods.${method}`, locale) || method;
}

export function getStepStatusLabel(status: string, locale: Locale = "fr"): string {
  return t(`step.statuses.${status}`, locale) || status;
}

export function getAttemptStatusLabel(status: string, locale: Locale = "fr"): string {
  return t(`attempt.statuses.${status}`, locale) || status;
}

export function getQualityLevelLabel(level: string, locale: Locale = "fr"): string {
  return t(`review.qualityLevels.${level}`, locale) || level;
}

export function getFieldTypeLabel(type: string, locale: Locale = "fr"): string {
  return t(`field.types.${type}`, locale) || type;
}

export function getActionLabel(action: string, locale: Locale = "fr"): string {
  return t(`actions.${action}`, locale) || action;
}

export function getMessage(key: string, locale: Locale = "fr", params?: Record<string, string | number>): string {
  return t(`messages.${key}`, locale, params);
}

export function getMediaLabel(key: string, locale: Locale = "fr", params?: Record<string, string | number>): string {
  return t(`media.${key}`, locale, params);
}