import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

/**
 * First onboarding screen.
 * Shows an inviting message and CTA to start onboarding flow.
 */
export type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to HabitSip</Text>
      <Text style={styles.subtitle}>Track your alcohol-free days and sip habits with a calm, minimalist app.</Text>
      <PrimaryButton
        title="Get Started"
        onPress={() => {
          navigation.navigate('Name');
        }}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0a1525',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#32415a',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    alignSelf: 'stretch',
  },
});

export default WelcomeScreen;
