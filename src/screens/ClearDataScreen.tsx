import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { clearLogs } from '../utils/logs';
import { usePalette } from '../contexts/ThemeContext';

export default function ClearDataScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const palette = usePalette();

  const handleClear = () => {
    Alert.alert('Confirm', 'Delete all drink logs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        style: 'destructive',
        onPress: async () => {
          await clearLogs();
          setStatus('Logs cleared');
          setTimeout(() => setStatus(null), 2000);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>      
      <View style={{ padding: 24 }}>
        <Text style={[styles.header, { color: palette.text }]}>Clear all data</Text>
        <PrimaryButton title="Clear data" onPress={handleClear} fullWidth style={{ marginTop: 20 }} />
        {status && <Text style={[styles.status, { color: palette.success }]}>{status}</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 18, fontWeight: '600' },
  status: { textAlign: 'center', marginTop: 12 },
});
