import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { exportLogsCsv } from '../utils/exportCsv';
import { usePalette } from '../contexts/ThemeContext';

export default function ExportDataScreen() {
  const [status, setStatus] = useState<string | null>(null);
  const palette = usePalette();

  const handleExport = async () => {
    try {
      await exportLogsCsv();
      setStatus('Exported!');
    } catch {
      setStatus('No logs to export');
    }
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>      
      <View style={{ padding: 24 }}>
        <Text style={[styles.header, { color: palette.text }]}>Export data (CSV)</Text>
        <PrimaryButton title="Export" onPress={handleExport} fullWidth style={{ marginTop: 20 }} />
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
