import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsHomeScreen from '../screens/SettingsHomeScreen';
import GeneralSettingsScreen from '../screens/GeneralSettingsScreen';
import ThemeSettingsScreen from '../screens/ThemeSettingsScreen';

export type SettingsStackParamList = {
  SettingsHome: undefined;
  GeneralSettings: undefined;
  ThemeSettings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
      <Stack.Screen name="GeneralSettings" component={GeneralSettingsScreen} />
      <Stack.Screen name="ThemeSettings" component={ThemeSettingsScreen} />
    </Stack.Navigator>
  );
}
