import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { usePalette } from '../contexts/ThemeContext';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
  fullWidth?: boolean;
}

const OptionButton: React.FC<Props> = ({ label, selected, onPress, style, fullWidth }) => {
  const palette = usePalette();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Pressable
      onPressIn={() => (scale.value = withTiming(0.97))}
      onPressOut={() => (scale.value = withTiming(1))}
      style={[styles.shadow, fullWidth && { alignSelf: 'stretch' }]}
      onPress={onPress}
    >
      <Animated.View style={[
        styles.base,
        {
          borderColor: palette.border,
          backgroundColor: selected ? palette.primary : 'transparent',
        },
        style,
      ]}>
        <Animated.View style={[animatedStyle]}>
          <Text style={[styles.label, { color: selected ? palette.background : palette.text }]}>{label}</Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OptionButton;
