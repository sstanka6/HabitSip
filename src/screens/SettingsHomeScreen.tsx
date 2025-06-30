import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsItem from '../components/SettingsItem';
import { CommonActions } from '@react-navigation/native';
import { saveBoolean } from '../utils/storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../navigation/SettingsNavigator';
import { usePalette } from '../contexts/ThemeContext';

export type SettingsHomeProps = NativeStackScreenProps<SettingsStackParamList, 'SettingsHome'>;

export default function SettingsHomeScreen({ navigation }: SettingsHomeProps) {
  const handleRedoOnboarding = async () => {
    await saveBoolean('onboardingDone', false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' as never }],
      })
    );
  };
  const palette = usePalette();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>App</Text>
        <SettingsItem label="General" onPress={() => navigation.navigate('GeneralSettings')} />
        <SettingsItem label="Theme" onPress={() => navigation.navigate('ThemeSettings')} />
        <SettingsItem label="Achievements" onPress={() => navigation.navigate('Achievements')} />
        <SettingsItem label="Show onboarding again" onPress={handleRedoOnboarding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
});
