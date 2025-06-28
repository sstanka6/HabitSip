import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { usePalette } from '../contexts/ThemeContext';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export default function Card({ children, style }: Props) {
  const palette = usePalette();
  return <View style={[styles.card, { backgroundColor: palette.card, shadowColor: palette.text }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Android shadow
    elevation: 4,
  },
});
