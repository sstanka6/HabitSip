import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import dayjs from 'dayjs';
import PrimaryButton from './PrimaryButton';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePalette } from '../contexts/ThemeContext';
import { DrinkLog } from '../utils/logs';

interface Props {
  visible: boolean;
  date: string;
  initialLog?: DrinkLog;
  onSave: (log: DrinkLog) => void;
  onDelete: (date: string) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'wine', label: 'Wine', icon: 'glass-wine' },
  { id: 'beer', label: 'Beer', icon: 'beer' },
  { id: 'cocktail', label: 'Cocktail', icon: 'glass-cocktail' },
  { id: 'champagne', label: 'Champagne', icon: 'glass-wine' },
  { id: 'strong', label: 'Strong', icon: 'bottle-tonic' },
  { id: 'custom', label: 'Custom', icon: 'cup-outline' },
];

export default function LogModal({ visible, date, initialLog, onSave, onDelete, onClose }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const obj: Record<string, number> = {};
    CATEGORIES.forEach(c => (obj[c.id] = 0));
    return obj;
  });
  const [note, setNote] = useState<string>('');
  const [selected, setSelected] = useState<string>('beer');
  const palette = usePalette();

  useEffect(() => {
    if (initialLog) {
      if (initialLog.breakdown) {
        setCounts(prev => ({ ...prev, ...initialLog.breakdown }));
      } else {
        const single = initialLog.type;
        if (single !== 'clean' && single) {
          setCounts(prev => ({ ...prev, [single]: initialLog.drinks }));
        }
      }
      setNote(initialLog.note || '');
    } else {
      setCounts(prev => {
        const cleared: Record<string, number> = {};
        CATEGORIES.forEach(c => (cleared[c.id] = 0));
        return cleared;
      });
      setNote('');
    }
  }, [initialLog, date]);

  if (!date) return null;

  const handleSavePress = () => {
    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    const activeCategories = Object.entries(counts).filter(([, v]) => v > 0);

    const log: DrinkLog = {
      date,
      drinks: total,
      type: total === 0 ? 'clean' : activeCategories.length === 1 ? activeCategories[0][0] : 'mixed',
      note: note.trim(),
      breakdown: counts,
    };
    onSave(log);
  };

  const handleZeroPress = () => {
    const log: DrinkLog = {
      date,
      drinks: 0,
      type: 'clean',
      note: note.trim(),
      breakdown: {},
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

          <Text style={[styles.label, { marginTop: 12 }]}>Optional note</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.iconRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelected(c.id)}
                style={[styles.iconWrap, selected === c.id && { borderColor: palette.primary }]}
              >
                <MaterialCommunityIcons
                  name={c.icon as any}
                  size={28}
                  color={selected === c.id ? palette.primary : palette.text}
                />
                <Text style={[styles.iconLabel, { color: palette.text }]}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.counterRow}>
            <TouchableOpacity
              onPress={() => setCounts(prev => ({ ...prev, [selected]: Math.max(0, prev[selected] - 1) }))}
            >
              <Ionicons name="remove-circle-outline" size={48} color={palette.primary} />
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: palette.text }]}>{counts[selected]}</Text>
            <TouchableOpacity
              onPress={() => setCounts(prev => ({ ...prev, [selected]: prev[selected] + 1 }))}
            >
              <Ionicons name="add-circle-outline" size={48} color={palette.primary} />
            </TouchableOpacity>
          </View>

          <PrimaryButton title="Save" onPress={handleSavePress} style={{ marginTop: 20 }} />

          {initialLog && (
            <TouchableOpacity onPress={() => onDelete(date)} style={{ marginTop: 12 }}>
              <Text style={{ color: '#e53935', textAlign: 'center' }}>Delete Entry</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} style={{ marginTop: 18 }}>
            <Text style={{ color: '#32415a', textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>

          <PrimaryButton title="Zero drinks" onPress={handleZeroPress} fullWidth style={{ marginTop: 14 }} />
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
    marginTop: 4
  },
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 },
  iconWrap: { alignItems: 'center', margin: 8, padding: 8, borderWidth: StyleSheet.hairlineWidth, borderRadius: 8 },
  iconLabel: { fontSize: 12, marginTop: 4 },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  counterValue: { fontSize: 28, marginHorizontal: 24, minWidth: 40, textAlign: 'center' },
});
