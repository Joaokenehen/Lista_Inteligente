import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegistrarScreen } from '../screens/RegistrarScreen';
import { AppNavigator } from './AppNavigator';

type AuthStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Registrar: undefined;
  App: undefined;
};

type AuthNavigatorProps = {
  onAuthenticated: () => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator({ onAuthenticated }: AuthNavigatorProps) {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard"
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' } 
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onAuthenticated={onAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Registrar" component={RegistrarScreen} />
      <Stack.Screen name="App" component={AppNavigator} />
    </Stack.Navigator>
  );
}