import "server-only";
import { cache } from "react";
import * as db from "./db";
import { isValidTimezone } from "./time";

/** Academy settings stored in hq_settings, with defaults matching the current website. */
export const SETTING_DEFAULTS = {
  academy_name: "Hidayatul Quran Academy",
  academy_email: "info@hidayatulquran.com",
  academy_phone: "+92 336 5398542",
  timezone: "Asia/Karachi",
  /** Comma separated staff addresses notified of new website submissions; empty = off. */
  notify_emails: "",
  /** Existing website behaviour: confirmation email to the person who submitted a form. */
  send_confirmations: "1",
  /** Existing website behaviour: a registration is refused when the email was already used. */
  reject_duplicate_registration_email: "1",
};
export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<SettingKey, string>;

export const getSettings = cache(async (): Promise<Settings> => {
  const settings: Settings = { ...SETTING_DEFAULTS };
  const rows = await db.all<{ setting_key: string; setting_value: string | null }>("SELECT setting_key, setting_value FROM hq_settings");
  for (const r of rows) {
    if (r.setting_key in settings) settings[r.setting_key as SettingKey] = r.setting_value ?? "";
  }
  if (!isValidTimezone(settings.timezone)) settings.timezone = "UTC";
  return settings;
});

export async function academyTimezone(): Promise<string> {
  return (await getSettings()).timezone;
}

export async function saveSetting(key: SettingKey, value: string, userId: number | null, ex?: Parameters<typeof db.exec>[2]) {
  await db.exec(
    `INSERT INTO hq_settings (setting_key, setting_value, updated_by, updated_at) VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by), updated_at = VALUES(updated_at)`,
    [key, value, userId, db.nowUtc()],
    ex,
  );
}
