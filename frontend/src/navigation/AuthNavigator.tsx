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
  sessaoExpirada?: boolean;
  onAuthenticated: () => void;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator({
  sessaoExpirada = false,
  onAuthenticated,
}: AuthNavigatorProps) {
  return (
    <Stack.Navigator 
      initialRouteName={sessaoExpirada ? 'Login' : 'Dashboard'}
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' } 
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onAuthenticated={onAuthenticated}
            mensagemInicial={
              sessaoExpirada ? 'Sua sessão expirou. Faça login novamente.' : undefined
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Registrar" component={RegistrarScreen} />
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