import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { usePalette } from '../contexts/ThemeContext';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, style, fullWidth }) => {
  const palette = usePalette();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      onPressIn={() => (scale.value = withTiming(0.97))}
      onPressOut={() => (scale.value = withTiming(1))}
      style={({ pressed }) => [styles.shadow, fullWidth && { alignSelf: 'stretch' }]} 
      onPress={onPress}
    >
      <Animated.View style={[styles.button, { backgroundColor: palette.primary }, animatedStyle, style]}>
        <Text style={styles.label}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrimaryButton;
