import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';
import { getString, getNumber, getBoolean, saveString, saveNumber, saveBoolean } from '../utils/storage';
import { updateDailyReminder } from '../utils/notifications';
import { exportLogsCsv } from '../utils/exportCsv';
import { clearLogs } from '../utils/logs';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { usePalette } from '../contexts/ThemeContext';

export default function GeneralSettingsScreen() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'Sobriety' | 'Moderation'>('Sobriety');
  const [cost, setCost] = useState('');
  const [reminder, setReminder] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const palette = usePalette();

  const load = async () => {
    const n = (await getString('userName')) || '';
    const g = (await getString('goal')) as 'Sobriety' | 'Moderation' | null;
    const c = await getNumber('avgCost');
    const r = await getBoolean('dailyReminder');
    const t = (await getString('reminderTime')) || '20:00';
    if (n) setName(n);
    if (g) setGoal(g);
    if (c !== null) setCost(c.toString());
    if (r !== null) setReminder(r);
    if (t) setReminderTime(t);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      setStatus('Name is required');
      return;
    }
    const costValue = parseFloat(cost);
    if (isNaN(costValue) || costValue <= 0) {
      setStatus('Enter a valid cost');
      return;
    }
    // Parse reminder time
    const [hourStr, minuteStr] = reminderTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      setStatus('Enter a valid time HH:MM');
      return;
    }

    await saveString('userName', name.trim());
    await saveString('goal', goal);
    await saveNumber('avgCost', costValue);
    await saveBoolean('dailyReminder', reminder);
    await saveString('reminderTime', reminderTime);
    await updateDailyReminder(reminder, hour, minute);
    setStatus('Saved!');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.header, { color: palette.text }]}>Profile</Text>
          <Text style={[styles.label, { color: palette.text }]}>Name / nickname</Text>
          <TextInput
            style={[styles.input, { borderColor: palette.border, backgroundColor: palette.card, color: palette.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={palette.border}
          />

          <Text style={[styles.header, { marginTop: 24, color: palette.text }]}>Goal</Text>
          <OptionButton
            label="Sobriety (no alcohol)"
            selected={goal === 'Sobriety'}
            onPress={() => setGoal('Sobriety')}
          />
          <OptionButton
            label="Moderation (cut back)"
            selected={goal === 'Moderation'}
            onPress={() => setGoal('Moderation')}
          />

          <Text style={[styles.header, { marginTop: 24, color: palette.text }]}>Average drink cost</Text>
          <TextInput
            style={[styles.input, { borderColor: palette.border, backgroundColor: palette.card, color: palette.text }]}
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
            placeholder="e.g. 8.50"
            placeholderTextColor={palette.border}
          />

          <View style={[styles.row, { marginTop: 24 }]}>
            <Text style={[styles.header, { color: palette.text }]}>Daily check-in reminder</Text>
            <Switch value={reminder} onValueChange={setReminder} />

            <View style={{ marginTop: 24 }}>
            <Text style={[styles.header, { color: palette.text }]}>Reminder time</Text>
            <TouchableOpacity
              style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: palette.border, backgroundColor: palette.card }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: palette.text, fontSize: 16 }}>{reminderTime}</Text>
              <Ionicons name="time" size={20} color={palette.text} />
            </TouchableOpacity>
          </View>
          </View>

{showTimePicker && (
            <Modal transparent animationType="slide" visible={showTimePicker} onRequestClose={() => setShowTimePicker(false)}>
              <View style={styles.modalCenter}>
                <View style={[styles.pickerCard, { backgroundColor: palette.card }]}>
                  <DateTimePicker
                    value={(() => { const [h,m] = reminderTime.split(':').map(Number); return new Date(1970,0,1,h,m); })()}
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      if (date) {
                        const h = date.getHours();
                        const m = date.getMinutes();
                        setReminderTime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
                      }
                    }}
                    style={{ backgroundColor: 'transparent' }}
                  />
                  <PrimaryButton title="Done" onPress={() => setShowTimePicker(false)} fullWidth style={{ marginTop: 12 }} />
                </View>
              </View>
            </Modal>
          )}

          <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 32 }} />
          {status && <Text style={[styles.status, { color: palette.success }]}>{status}</Text>}
          <PrimaryButton
            title="Export data (CSV)"
            onPress={async () => {
              try {
                await exportLogsCsv();
                setExportStatus('Exported!');
              } catch {
                setExportStatus('No logs to export');
              }
              setTimeout(() => setExportStatus(null), 2000);
            }}
            style={{ marginTop: 16 }}
          />
          {exportStatus && <Text style={[styles.status, { color: palette.success }]}>{exportStatus}</Text>}
          <PrimaryButton
            title="Clear all data"
            onPress={() => {
              Alert.alert('Confirm', 'Delete all logs?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'OK',
                  style: 'destructive',
                  onPress: async () => {
                    await clearLogs();
                    setStatus('Logs cleared');
                    setTimeout(() => setStatus(null), 2000);
                  },
                },
              ]);
            }}
            style={{ marginTop: 16 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    padding: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    textAlign: 'center',
    marginTop: 12,
  },
  modalCenter: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerCard: { padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
});
