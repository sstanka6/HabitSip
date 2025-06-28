import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { saveNumber } from '../utils/storage';

export type CostScreenProps = NativeStackScreenProps<RootStackParamList, 'Cost'>;

const CostScreen: React.FC<CostScreenProps> = ({ navigation }) => {
  const [cost, setCost] = useState('');

  const handleNext = async () => {
    const value = parseFloat(cost);
    if (isNaN(value) || value <= 0) return;
    await saveNumber('avgCost', value);
    navigation.navigate('Reminder');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Average cost per drink?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 8.50"
          keyboardType="numeric"
          value={cost}
          onChangeText={setCost}
        />
      </View>
      <PrimaryButton title="Next" onPress={handleNext} style={{ opacity: cost.trim() ? 1 : 0.5 }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0a1525',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default CostScreen;
