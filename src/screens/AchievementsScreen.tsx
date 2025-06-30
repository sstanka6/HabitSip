import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePalette } from '../contexts/ThemeContext';
import { getLogs, DrinkLog } from '../utils/logs';
import { spacing } from '../styles/spacing';
import Card from '../components/Card';
import { Ionicons } from '@expo/vector-icons';

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: (logs: DrinkLog[]) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_clean',
    title: 'First Clean Day',
    description: 'Log your first day with 0 drinks',
    achieved: logs => logs.some(l => l.drinks === 0),
  },
  {
    id: 'seven_streak',
    title: '7-Day Streak',
    description: 'Stay clean for 7 consecutive days',
    achieved: logs => longestStreak(logs) >= 7,
  },
  {
    id: 'thirty_streak',
    title: '30-Day Streak',
    description: 'Stay clean for 30 consecutive days',
    achieved: logs => longestStreak(logs) >= 30,
  },
  {
    id: 'hundred_clean',
    title: '100 Clean Days',
    description: 'Accumulate 100 clean days overall',
    achieved: logs => logs.filter(l => l.drinks === 0).length >= 100,
  },
];

function longestStreak(logs: DrinkLog[]): number {
  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  let best = 0;
  let run = 0;
  sorted.forEach(l => {
    if (l.drinks === 0) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  });
  return best;
}

export default function AchievementsScreen() {
  const palette = usePalette();
  const [achieved, setAchieved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const logs = await getLogs();
      const status: Record<string, boolean> = {};
      ACHIEVEMENTS.forEach(a => (status[a.id] = a.achieved(logs)));
      setAchieved(status);
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing(4) }}>
        {ACHIEVEMENTS.map(a => {
          const unlocked = achieved[a.id];
          return (
            <Card key={a.id} style={[styles.card, { opacity: unlocked ? 1 : 0.4 }]}>
              <View style={styles.row}>
                <Ionicons
                  name={unlocked ? 'trophy' : 'lock-closed'}
                  size={24}
                  color={unlocked ? palette.success : palette.border}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.title, { color: palette.text }]}>{a.title}</Text>
                  <Text style={[styles.desc, { color: palette.text }]}>{a.description}</Text>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { marginBottom: spacing(4) },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600' },
  desc: { fontSize: 13 },
});
