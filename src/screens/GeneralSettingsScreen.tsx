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
import { SafeAreaView } from 'react-native-safe-area-context';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';
import { getString, getNumber, getBoolean, saveString, saveNumber, saveBoolean } from '../utils/storage';
import { usePalette } from '../contexts/ThemeContext';

export default function GeneralSettingsScreen() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'Sobriety' | 'Moderation'>('Sobriety');
  const [cost, setCost] = useState('');
  const [reminder, setReminder] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const palette = usePalette();

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
    <SafeAreaView style={[styles.root, { backgroundColor: palette.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.header, { color: palette.text }]}>Profile</Text>
          <Text style={[styles.label, { color: palette.text }]}>Name / nickname</Text>
          <TextInput
            style={[styles.input, { borderColor: palette.border, backgroundColor: palette.card, color: palette.text }]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={palette.border}
          />

          <Text style={[styles.header, { marginTop: 24, color: palette.text }]}>Goal</Text>
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

          <Text style={[styles.header, { marginTop: 24, color: palette.text }]}>Average drink cost</Text>
          <TextInput
            style={[styles.input, { borderColor: palette.border, backgroundColor: palette.card, color: palette.text }]}
            keyboardType="numeric"
            value={cost}
            onChangeText={setCost}
            placeholder="e.g. 8.50"
            placeholderTextColor={palette.border}
          />

          <View style={[styles.row, { marginTop: 24 }]}>
            <Text style={[styles.header, { color: palette.text }]}>Daily check-in reminder</Text>
            <Switch value={reminder} onValueChange={setReminder} />
          </View>

          <PrimaryButton title="Save" onPress={handleSave} style={{ marginTop: 32 }} />
          {status && <Text style={[styles.status, { color: palette.success }]}>{status}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    padding: 24,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    textAlign: 'center',
    marginTop: 12,
  },
});
