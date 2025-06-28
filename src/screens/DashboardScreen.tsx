import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <Text style={[styles.header, { color: palette.text }]}>Current streak</Text>
      <Text style={[styles.metric, { color: palette.text }]}>{stats.currentStreak} days</Text>

      <Text style={[styles.header, { color: palette.text }]}>Best streak</Text>
      <Text style={[styles.metric, { color: palette.text }]}>{stats.bestStreak} days</Text>

      <Text style={[styles.header, { color: palette.text }]}>Clean days this month</Text>
      <Text style={[styles.metric, { color: palette.text }]}>{stats.cleanThisMonth}</Text>

      <Text style={[styles.header, { color: palette.text }]}>Total drinks this week</Text>
      <Text style={[styles.metric, { color: palette.text }]}>{stats.drinksThisWeek}</Text>

      <Text style={[styles.header, { color: palette.text }]}>Money saved</Text>
      <Text style={[styles.metric, { color: palette.text }]}>${stats.moneySaved.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    marginTop: 20,
  },
  metric: {
    fontSize: 32,
    fontWeight: '700',
  },
  title: { fontSize: 20 },
});
