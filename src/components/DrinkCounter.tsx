import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../styles/spacing';
import { usePalette } from '../contexts/ThemeContext';

interface Props {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: number;
  onChange: (next: number) => void;
}

export default function DrinkCounter({ label, icon, value, onChange }: Props) {
  const palette = usePalette();
  const minus = () => onChange(Math.max(0, value - 1));
  const plus = () => onChange(value + 1);

  return (
    <View style={[styles.row, { borderColor: palette.border }]}>
      <MaterialCommunityIcons name={icon as any} size={24} color={palette.text} style={{ width: 28 }} />
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      <View style={styles.flex} />
      <TouchableOpacity onPress={minus} style={styles.btn}>
        <Ionicons name="remove-circle-outline" size={28} color={palette.primary} />
      </TouchableOpacity>
      <Text style={[styles.value, { color: palette.text }]}>{value}</Text>
      <TouchableOpacity onPress={plus} style={styles.btn}>
        <Ionicons name="add-circle-outline" size={28} color={palette.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing(2),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  flex: { flex: 1 },
  label: { fontSize: 16 },
  value: { fontSize: 16, width: 24, textAlign: 'center' },
  btn: { paddingHorizontal: 4 },
});
