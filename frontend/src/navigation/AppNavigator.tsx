import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ListaComprasScreen } from '../screens/ListaComprasScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { SelecionarPerfilScreen } from '../screens/SelecionarPerfilScreen';
import { SobreScreen } from '../screens/SobreScreen';
import { PlanejamentoScreen } from '../screens/PlanejamentoScreen';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';

const Stack = createNativeStackNavigator();

type AppNavigatorProps = {
  autenticado: boolean;
  onSair: () => void;
};

export function AppNavigator({ autenticado, onSair }: AppNavigatorProps) {
  return (
    <Stack.Navigator 
      initialRouteName="SelecionarPerfilScreen"
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' } 
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SelecionarPerfilScreen" component={SelecionarPerfilScreen} />
      <Stack.Screen name="PerfilScreen" component={PerfilScreen} />
      <Stack.Screen name="PlanejamentoScreen" component={PlanejamentoScreen} />
      <Stack.Screen name="ListaComprasScreen" component={ListaComprasScreen} />
      <Stack.Screen name="HistoricoScreen" component={HistoricoScreen} />
      <Stack.Screen name="SobreScreen" component={SobreScreen} />
      <Stack.Screen name="ConfiguracoesScreen">
        {(props) => (
          <ConfiguracoesScreen
            {...props}
            autenticado={autenticado}
            onSair={onSair}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}