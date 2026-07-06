declare const process: any;

export type StorageMode = "mock" | "json" | "notion" | "hubspot" | "google_sheets";

export const SYSTEM_NAME = "Partner Intake OS";
export const SYSTEM_VERSION = "0.5.0";

export function getEnv(name: string, fallback = ""): string {
  const value = process?.env?.[name];
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
}

export function getActionToken(): string {
  return getEnv("PARTNER_INTAKE_ACTION_TOKEN");
}

export function getTallySigningSecret(): string {
  return getEnv("TALLY_SIGNING_SECRET");
}

export function getPartnerIntakeEnv(): string {
  return getEnv("PARTNER_INTAKE_ENV", "development");
}

export function getStorageMode(): StorageMode {
  const value = getEnv("PARTNER_INTAKE_STORAGE_MODE", "mock") as StorageMode;
  const allowed: StorageMode[] = ["mock", "json", "notion", "hubspot", "google_sheets"];
  return allowed.includes(value) ? value : "mock";
}

export function getRuntimeConfig() {
  return {
    system: SYSTEM_NAME,
    version: SYSTEM_VERSION,
    env: getPartnerIntakeEnv(),
    storage_mode: getStorageMode(),
    has_action_token: getActionToken().length > 0,
    has_tally_signing_secret: getTallySigningSecret().length > 0
  };
}

export function getRequiredEnvStatus() {
  const actionToken = getActionToken();
  const tallySecret = getTallySigningSecret();

  return {
    PARTNER_INTAKE_ACTION_TOKEN: actionToken.length > 0 ? "set" : "missing",
    TALLY_SIGNING_SECRET: tallySecret.length > 0 ? "set" : "optional_missing",
    PARTNER_INTAKE_ENV: getPartnerIntakeEnv(),
    PARTNER_INTAKE_STORAGE_MODE: getStorageMode()
  };
}
