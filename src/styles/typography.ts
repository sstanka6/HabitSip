import { StyleSheet } from 'react-native';
import { spacing } from './spacing';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing(3),
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: spacing(2),
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    opacity: 0.7,
  },
});
