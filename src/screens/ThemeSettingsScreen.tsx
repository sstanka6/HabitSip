import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';
import OptionButton from '../components/OptionButton';
import { useThemePref, usePalette } from '../contexts/ThemeContext';

export type ThemeSettingsProps = NativeStackScreenProps<SettingsStackParamList, 'ThemeSettings'>;

export default function ThemeSettingsScreen({ navigation }: ThemeSettingsProps) {
  const { preference, setPreference } = useThemePref();
  const palette = usePalette();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={[styles.header, { color: palette.text }]}>Theme</Text>
        <OptionButton
          label="Light"
          selected={preference === 'light'}
          onPress={() => setPreference('light')}
        />
        <OptionButton
          label="Dark"
          selected={preference === 'dark'}
          onPress={() => setPreference('dark')}
        />
        <OptionButton
          label="Use system"
          selected={preference === 'system'}
          onPress={() => setPreference('system')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});
