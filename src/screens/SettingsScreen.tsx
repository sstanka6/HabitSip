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
} from 'react-native';
import { getString, getNumber, getBoolean, saveString, saveNumber, saveBoolean } from '../utils/storage';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemePref } from '../contexts/ThemeContext';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'Sobriety' | 'Moderation'>('Sobriety');
  const [cost, setCost] = useState('');
  const [reminder, setReminder] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const { preference, setPreference } = useThemePref();

  const load = async () => {
    const n = (await getString('userName')) || '';
    const g = (await getString('goal')) as 'Sobriety' | 'Moderation' | null;
    const c = await getNumber('avgCost');
    const r = await getBoolean('dailyReminder');

    if (n) setName(n);
    if (g) setGoal(g);
    if (c !== null) setCost(c.toString());
    if (r !== null) setReminder(r);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    // theme preference already persisted via context

    if (!name.trim()) {
      setStatus('Name is required');
      return;
    }
    const costValue = parseFloat(cost);
    if (isNaN(costValue) || costValue <= 0) {
      setStatus('Enter a valid cost');
      return;
    }
    await saveString('userName', name.trim());
    await saveString('goal', goal);
    await saveNumber('avgCost', costValue);
    await saveBoolean('dailyReminder', reminder);
    setStatus('Saved!');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>Profile</Text>
          <Text style={styles.label}>Name / nickname</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />

          <Text style={[styles.header, { marginTop: 24 }]}>Goal</Text>
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

          <Text style={[styles.header, { marginTop: 24 }]}>Average drink cost</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
            placeholder="e.g. 8.50"
          />

          <View style={[styles.row, { marginTop: 24 }]}>
            <View>
              <Text style={styles.header}>Daily check-in reminder</Text>
            </View>
            <Switch value={reminder} onValueChange={setReminder} />
          </View>

          <Text style={[styles.header, { marginTop: 24 }]}>Appearance</Text>
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

          <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 32 }} />
          {status && <Text style={styles.status}>{status}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#32415a',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#32415a',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    textAlign: 'center',
    marginTop: 12,
    color: '#4caf50',
  },
});
