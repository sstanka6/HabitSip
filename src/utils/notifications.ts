import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Request permission if needed
async function ensurePermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === 'granted';
}

function dailyTrigger(hour: number, minute: number) {
  return { hour, minute, repeats: true } as any;
}

export async function cancelDailyReminder() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleDailyReminder(hour: number = 20, minute: number = 0) {
  const granted = await ensurePermission();
  if (!granted) return;
  // Clear previous to avoid duplicates
  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'HabitSip check-in',
      body: "Don't forget to log your drinks today!",
      sound: Platform.OS === 'ios' ? 'default' : undefined,
    },
    trigger: dailyTrigger(hour, minute), // 8 pm local time
  });
}

export async function updateDailyReminder(enabled: boolean, hour: number = 20, minute: number = 0) {
  if (enabled) {
    await scheduleDailyReminder(hour, minute);
  } else {
    await cancelDailyReminder();
  }
}
