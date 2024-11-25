import { retrieveUserSettings, storeUserSettings } from "@/libs/storage/chrome.storage";
import { UserStatistics } from "@/libs/storage/storaged.types";

export async function updateStatisticsAdd(key: keyof UserStatistics, value: number = 1) {
  const { statistics } = await retrieveUserSettings(["statistics"]);
  statistics[key] += value;
  await storeUserSettings({ statistics });
}

export async function updateStatisticsSubtract(key: keyof UserStatistics, value: number = 1) {
  const { statistics } = await retrieveUserSettings(["statistics"]);
  statistics[key] -= value;
  await storeUserSettings({ statistics });
}

export async function updateStatisticsSet(key: keyof UserStatistics, value: number) {
  const { statistics } = await retrieveUserSettings(["statistics"]);
  statistics[key] = value;
  await storeUserSettings({ statistics });
}
