export const SYSTEM_MENU_EVENT = "rpg:system-menu";
export const ACHIEVEMENT_EVENT = "rpg:achievement";

type AchievementPayload = {
  id: string;
  title: string;
  description: string;
};

const ACHIEVEMENT_STORAGE_KEY = "yexinmei:rpg:achievements";

export function openSystemMenu() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SYSTEM_MENU_EVENT));
}

function readStringSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.localStorage.getItem(key);
    const values = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(values) ? values.filter((value) => typeof value === "string") : []);
  } catch {
    return new Set();
  }
}

function writeStringSet(key: string, values: Set<string>) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(values)));
  } catch {
    // Storage can be unavailable in private/restricted browsing. The UI should still work.
  }
}

export function unlockAchievement(payload: AchievementPayload) {
  if (typeof window === "undefined") return;

  const unlocked = readStringSet(ACHIEVEMENT_STORAGE_KEY);
  if (unlocked.has(payload.id)) return;

  unlocked.add(payload.id);
  writeStringSet(ACHIEVEMENT_STORAGE_KEY, unlocked);
  window.dispatchEvent(new CustomEvent<AchievementPayload>(ACHIEVEMENT_EVENT, { detail: payload }));
}

export function markAchievementProgress(
  group: string,
  itemId: string,
  total: number,
  achievement: AchievementPayload
) {
  if (typeof window === "undefined") return;

  const key = `yexinmei:rpg:progress:${group}`;
  const progress = readStringSet(key);
  progress.add(itemId);
  writeStringSet(key, progress);

  if (progress.size >= total) {
    unlockAchievement(achievement);
  }
}
