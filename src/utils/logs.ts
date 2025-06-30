import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

export interface DrinkLog {
  date: string; // YYYY-MM-DD
  drinks: number; // total drinks, 0 for clean day
  type: string; // general category or 'mixed'/'clean'
  note?: string;
  breakdown?: Record<string, number>; // per-category counts, e.g. { beer:2, wine:1 }
}

const KEY = 'drinkLogs';

export async function getLogs(): Promise<DrinkLog[]> {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json ? (JSON.parse(json) as DrinkLog[]) : [];
  } catch (e) {
    console.warn('getLogs error', e);
    return [];
  }
}

export async function saveLog(entry: DrinkLog) {
  const logs = await getLogs();
  const others = logs.filter(l => l.date !== entry.date);
  const updated = [...others, entry];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function deleteLog(date: string) {
  const logs = await getLogs();
  const updated = logs.filter(l => l.date !== date);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function clearLogs() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.warn('clearLogs error', e);
  }
}

export async function getLogForDate(date: string): Promise<DrinkLog | undefined> {
  const logs = await getLogs();
  return logs.find(l => l.date === date);
}

export async function getStatsForPeriod(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  const logs = await getLogs();
  const rangeLogs = logs.filter(l => dayjs(l.date).isBetween(start, end, 'day', '[]'));
  const drinks = rangeLogs.reduce((sum, l) => sum + (l.drinks || 0), 0);
  const cleanDays = rangeLogs.filter(l => l.drinks === 0).length;
  return { drinks, cleanDays };
}
