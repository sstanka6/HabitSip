import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveString(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.warn('Failed to save', key, e);
  }
}

export async function saveBoolean(key: string, value: boolean) {
  await saveString(key, JSON.stringify(value));
}

export async function saveNumber(key: string, value: number) {
  await saveString(key, value.toString());
}

export async function getString(key: string) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v;
  } catch (e) {
    console.warn('Failed to load', key, e);
    return null;
  }
}

export async function getBoolean(key: string) {
  const v = await getString(key);
  return v !== null ? JSON.parse(v) as boolean : null;
}

export async function getNumber(key: string) {
  const v = await getString(key);
  return v !== null ? Number(v) : null;
}
