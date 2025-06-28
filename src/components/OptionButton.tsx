import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { usePalette } from '../contexts/ThemeContext';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const OptionButton: React.FC<Props> = ({ label, selected, onPress, style }) => {
  const palette = usePalette();
  return (
    <Pressable
      style={[
        styles.base,
        {
          borderColor: palette.primary,
          backgroundColor: selected ? palette.primary : 'transparent',
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, { color: selected ? palette.background : palette.primary }]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginVertical: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OptionButton;
