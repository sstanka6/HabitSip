import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from '../components/PrimaryButton';
import { getBoolean, getString, saveBoolean, saveString } from '../utils/storage';
import { updateDailyReminder } from '../utils/notifications';
import { usePalette } from '../contexts/ThemeContext';

export default function ReminderSettingsScreen() {
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [showPicker, setShowPicker] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const palette = usePalette();

  const load = async () => {
    const r = await getBoolean('dailyReminder');
    const t = (await getString('reminderTime')) || '20:00';
    if (r !== null) setReminder(r);
    if (t) setReminderTime(t);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    const [hourStr, minuteStr] = reminderTime.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour) || isNaN(minute)) {
      setStatus('Enter valid time');
      return;
    }
    await saveBoolean('dailyReminder', reminder);
    await saveString('reminderTime', reminderTime);
    await updateDailyReminder(reminder, hour, minute);
    setStatus('Saved!');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>      
      <View style={{ padding: 24 }}>
        <Text style={[styles.header, { color: palette.text }]}>Daily check-in reminder</Text>
        <Switch value={reminder} onValueChange={setReminder} />

        <Text style={[styles.header, { marginTop: 24, color: palette.text }]}>Reminder time</Text>
        <TouchableOpacity
          style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: palette.border, backgroundColor: palette.card }]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: palette.text, fontSize: 16 }}>{reminderTime}</Text>
          <Ionicons name="time" size={20} color={palette.text} />
        </TouchableOpacity>

        {showPicker && (
          Platform.OS === 'ios' ? (
            <Modal transparent animationType="slide" visible={showPicker} onRequestClose={() => setShowPicker(false)}>
              <View style={styles.modalCenter}>
                <View style={[styles.pickerCard, { backgroundColor: palette.card }]}>                
                  <DateTimePicker
                    value={(() => { const [h,m] = reminderTime.split(':').map(Number); return new Date(1970,0,1,h,m); })()}
                    mode="time"
                    display="spinner"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      if (date) {
                        const h = date.getHours();
                        const m = date.getMinutes();
                        setReminderTime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
                      }
                    }}
                  />
                  <PrimaryButton title="Done" onPress={() => setShowPicker(false)} fullWidth style={{ marginTop: 12 }} />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={(() => { const [h,m] = reminderTime.split(':').map(Number); return new Date(1970,0,1,h,m); })()}
              mode="time"
              display="default"
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                setShowPicker(false);
                if (event.type === 'set' && date) {
                  const h = date.getHours();
                  const m = date.getMinutes();
                  setReminderTime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
                }
              }}
            />
          )
        )}

        <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 32 }} />
        {status && <Text style={[styles.status, { color: palette.success }]}>{status}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
  },
  status: { textAlign: 'center', marginTop: 12 },
  modalCenter: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerCard: { padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
});
