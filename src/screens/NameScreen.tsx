import React, { useState } from 'react';
import { saveString } from '../utils/storage';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

export type NameScreenProps = NativeStackScreenProps<RootStackParamList, 'Name'>;

const NameScreen: React.FC<NameScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleNext = async () => {
    if (!name.trim()) return;
    await saveString('userName', name.trim());
    navigation.navigate('Goal');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>What should we call you?</Text>
        <TextInput
          style={styles.input}
          placeholder="Your name or nickname"
          value={name}
          onChangeText={setName}
          autoFocus
        />
      </View>
      <PrimaryButton
        title="Next"
        onPress={handleNext}
        style={{ opacity: name.trim() ? 1 : 0.5 }}
      />
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

export default NameScreen;
