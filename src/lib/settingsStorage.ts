import { AppSettings, DEFAULT_SETTINGS } from "./settingsTypes";

export const STORAGE_KEY = "guild_os_settings_v1";

export function loadSettingsFromStorage(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error("Failed to load settings from localStorage:", err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: AppSettings): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error("Failed to save settings to localStorage:", err);
    return false;
  }
}

export function resetSettingsStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to reset settings storage:", err);
  }
}
