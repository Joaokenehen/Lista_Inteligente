import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AppNavigator } from './AppNavigator';

type AuthStackParamList = {
  Dashboard: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="App">
        {(props) => (
          <AppNavigator
            autenticado={false}
            onSair={() => props.navigation.navigate('Dashboard')}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}