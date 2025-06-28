import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import dayjs from 'dayjs';
import PrimaryButton from './PrimaryButton';
import { DrinkLog } from '../utils/logs';

interface Props {
  visible: boolean;
  date: string;
  initialLog?: DrinkLog;
  onSave: (log: DrinkLog) => void;
  onDelete: (date: string) => void;
  onClose: () => void;
}

export default function LogModal({ visible, date, initialLog, onSave, onDelete, onClose }: Props) {
  const [drinks, setDrinks] = useState<string>('0');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (initialLog) {
      setDrinks(initialLog.drinks.toString());
      setNote(initialLog.note || '');
    } else {
      setDrinks('0');
      setNote('');
    }
  }, [initialLog, date]);

  if (!date) return null;

  const handleSavePress = () => {
    const num = Number(drinks);
    if (isNaN(num) || num < 0) return;
    const log: DrinkLog = {
      date,
      drinks: num,
      type: num === 0 ? 'clean' : 'custom',
      note: note.trim(),
    };
    onSave(log);
  };

  const formatted = dayjs(date).format('dddd, MMM D YYYY');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.center}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{formatted}</Text>

          <Text style={styles.label}>Number of drinks (0 = clean day)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={drinks}
            onChangeText={setDrinks}
          />

          <Text style={[styles.label, { marginTop: 16 }]}>Optional note</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={note}
            onChangeText={setNote}
          />

          <PrimaryButton title="Save" onPress={handleSavePress} style={{ marginTop: 20 }} />

          {initialLog && (
            <TouchableOpacity onPress={() => onDelete(date)} style={{ marginTop: 12 }}>
              <Text style={{ color: '#e53935', textAlign: 'center' }}>Delete Entry</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} style={{ marginTop: 18 }}>
            <Text style={{ color: '#32415a', textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  card: {
    margin: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#32415a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
});
