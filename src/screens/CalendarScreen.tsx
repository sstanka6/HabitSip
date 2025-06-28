import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePalette } from '../contexts/ThemeContext';
import { Calendar, DateData } from 'react-native-calendars';
import dayjs from 'dayjs';
import { getLogs, getLogForDate, saveLog, deleteLog, DrinkLog } from '../utils/logs';
import LogModal from '../components/LogModal';

interface MarkedDate {
  selected: boolean;
  selectedColor: string;
}

export default function CalendarScreen() {
  const palette = usePalette();
  const [marked, setMarked] = useState<Record<string, MarkedDate>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<DrinkLog | undefined>(undefined);

  const refreshMarked = async () => {
    const logs = await getLogs();
    const map: Record<string, MarkedDate> = {};
    logs.forEach(l => {
      map[l.date] = {
        selected: true,
        selectedColor: l.drinks === 0 ? '#4caf50' : '#e53935',
      };
    });
    setMarked(map);
  };

  useEffect(() => {
    refreshMarked();
  }, []);

  const handleDayPress = async (day: DateData) => {
    const date = day.dateString; // YYYY-MM-DD
    setSelectedDate(date);
    const log = await getLogForDate(date);
    setSelectedLog(log);
    setModalVisible(true);
  };

  const handleSave = async (log: DrinkLog) => {
    await saveLog(log);
    setModalVisible(false);
    refreshMarked();
  };

  const handleDelete = async (date: string) => {
    await deleteLog(date);
    setModalVisible(false);
    refreshMarked();
  };

  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: palette.background }]}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={marked}
        theme={{
          backgroundColor: palette.background,
          calendarBackground: palette.background,
          monthTextColor: palette.text,
          dayTextColor: palette.text,
          textDisabledColor: palette.border,
          todayTextColor: palette.primary,
          arrowColor: palette.primary,
        }}
      />
      <LogModal
        visible={modalVisible}
        date={selectedDate}
        initialLog={selectedLog}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
