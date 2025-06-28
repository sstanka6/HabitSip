import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import OptionButton from '../components/OptionButton';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { saveString } from '../utils/storage';

export type GoalScreenProps = NativeStackScreenProps<RootStackParamList, 'Goal'>;

const GoalScreen: React.FC<GoalScreenProps> = ({ navigation }) => {
  const [goal, setGoal] = useState<'Sobriety' | 'Moderation' | null>(null);

  const handleNext = async () => {
    if (!goal) return;
    await saveString('goal', goal);
    navigation.navigate('Cost');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your goal?</Text>
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
      <PrimaryButton
        title="Next"
        onPress={handleNext}
        style={{ marginTop: 32, opacity: goal ? 1 : 0.5 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0a1525',
    marginBottom: 24,
  },
});

export default GoalScreen;
