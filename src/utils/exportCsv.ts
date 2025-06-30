import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import dayjs from 'dayjs';
import { getLogs, DrinkLog } from './logs';

function toCsvRow(row: (string | number)[]): string {
  return row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
}

export async function exportLogsCsv(): Promise<void> {
  const logs: DrinkLog[] = await getLogs();
  if (logs.length === 0) throw new Error('No logs');

  const header = ['Date', 'Drinks', 'Type', 'Note'];
  const rows = logs.map(l => [l.date, l.drinks, l.type, l.note || '']);
  const csv = [header, ...rows].map(toCsvRow).join('\n');

  const fileName = `habitSip_logs_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
  const path = FileSystem.cacheDirectory + fileName;
  await FileSystem.writeAsStringAsync(path, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  await Sharing.shareAsync(path, {
    mimeType: 'text/csv',
    dialogTitle: 'Share HabitSip Logs',
  });
}
