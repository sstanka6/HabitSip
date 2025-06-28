import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { saveBoolean } from '../utils/storage';

export type ReminderScreenProps = NativeStackScreenProps<RootStackParamList, 'Reminder'>;

const ReminderScreen: React.FC<ReminderScreenProps> = ({ navigation }) => {
  const [enabled, setEnabled] = useState(false);

  const handleNext = async () => {
    await saveBoolean('dailyReminder', enabled);
    await saveBoolean('onboardingDone', true);
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily check-in reminder?</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Enable reminder</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      <PrimaryButton title="Finish" onPress={handleNext} style={{ marginTop: 40 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0a1525',
    marginBottom: 32,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 18,
    color: '#0a1525',
  },
});

export default ReminderScreen;
