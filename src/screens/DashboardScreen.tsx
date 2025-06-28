import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Card from '../components/Card';
import { spacing } from '../styles/spacing';
import { typography } from '../styles/typography';
import dayjs from 'dayjs';
import { getLogs, DrinkLog } from '../utils/logs';
import { getNumber } from '../utils/storage';
import { usePalette } from '../contexts/ThemeContext';

interface Stats {
  currentStreak: number;
  bestStreak: number;
  cleanThisMonth: number;
  drinksThisWeek: number;
  moneySaved: number;
}



export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null);

  const palette = usePalette();
  

  const computeStats = async () => {
    const logs = await getLogs();
    const today = dayjs();

    // Build a map for easier lookup
    const logMap = new Map<string, DrinkLog>();
    logs.forEach(l => logMap.set(l.date, l));

    // Current streak
    let currentStreak = 0;
    for (let d = today; ; d = d.subtract(1, 'day')) {
      const key = d.format('YYYY-MM-DD');
      const log = logMap.get(key);
      if (log && log.drinks === 0) {
        currentStreak += 1;
      } else if (!log) {
        // Unlogged day breaks streak
        break;
      } else {
        break;
      }
      if (d.diff(today, 'day') <= -30) break; // safety break
    }

    // Best streak ever
    let bestStreak = 0;
    let running = 0;
    const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach(l => {
      if (l.drinks === 0) {
        running += 1;
        if (running > bestStreak) bestStreak = running;
      } else {
        running = 0;
      }
    });

    // Clean days this month
    const startOfMonth = today.startOf('month');
    const cleanThisMonth = logs.filter(l => l.drinks === 0 && dayjs(l.date).isAfter(startOfMonth.subtract(1, 'day'))).length;

    // Drinks this week
    const weekAgo = today.subtract(6, 'day');
    const drinksThisWeek = logs
      .filter(l => dayjs(l.date).isAfter(weekAgo.subtract(1, 'day')))
      .reduce((sum, l) => sum + l.drinks, 0);

    // Money saved: clean days * avgCost
    const avgCost = (await getNumber('avgCost')) || 0;
    const moneySaved = cleanThisMonth * avgCost;

    setStats({ currentStreak, bestStreak, cleanThisMonth, drinksThisWeek, moneySaved });
  };

  useEffect(() => {
    const unsub = setInterval(computeStats, 2000); // refresh periodically
    computeStats();
    return () => clearInterval(unsub);
  }, []);



  if (!stats) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
        <ScrollView>
          <Text style={styles.title}>Loading...</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
      <ScrollView>
        <View style={styles.grid}>
          <Card style={styles.card}>
            <Text style={[typography.caption, { color: palette.text }]}>Current streak</Text>
            <Text style={[typography.h2, { color: palette.text }]}>{stats.currentStreak} days</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={[typography.caption, { color: palette.text }]}>Best streak</Text>
            <Text style={[typography.h2, { color: palette.text }]}>{stats.bestStreak} days</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={[typography.caption, { color: palette.text }]}>Clean days this month</Text>
            <Text style={[typography.h2, { color: palette.text }]}>{stats.cleanThisMonth}</Text>
          </Card>
          <Card style={styles.card}>
            <Text style={[typography.caption, { color: palette.text }]}>Drinks this week</Text>
            <Text style={[typography.h2, { color: palette.text }]}>{stats.drinksThisWeek}</Text>
          </Card>
          <Card style={[styles.card, { flexBasis: '100%' }]}>
            <Text style={[typography.caption, { color: palette.text }]}>Money saved</Text>
            <Text style={[typography.h2, { color: palette.text }]}>${stats.moneySaved.toFixed(2)}</Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing(4),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    flexBasis: '48%',
    marginBottom: spacing(4),
  },
  title: { fontSize: 20 },
});
