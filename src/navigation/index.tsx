import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import { View, ActivityIndicator } from 'react-native';
import { getBoolean } from '../utils/storage';

export type RootStackParamList = {
  Welcome: undefined;
  Name: undefined;
  Goal: undefined;
  Cost: undefined;
  Reminder: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [initialRoute, setInitialRoute] = useState<string | undefined>();

  useEffect(() => {
    const check = async () => {
      const done = await getBoolean('onboardingDone');
      setInitialRoute(done ? 'Tabs' : 'Welcome');
    };
    check();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute as any}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Name" component={require('../screens/NameScreen').default} />
      <Stack.Screen name="Goal" component={require('../screens/GoalScreen').default} />
      <Stack.Screen name="Cost" component={require('../screens/CostScreen').default} />
      <Stack.Screen name="Reminder" component={require('../screens/ReminderScreen').default} />
      <Stack.Screen name="Tabs" component={require('./TabNavigator').default} />
    </Stack.Navigator>
  );
}
