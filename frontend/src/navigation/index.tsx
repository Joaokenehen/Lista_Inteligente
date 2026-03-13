import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Todas as importações usando caminhos relativos padrão (../)
import { HomeScreen } from '../screens/HomeScreen';
import { ListaComprasScreen } from '../screens/ListaComprasScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { SelecionarPerfilScreen } from '../screens/SelecionarPerfilScreen';

// Crie o Stack sem desestruturar o 'Screen' isoladamente
const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#F8FAFC' } 
      }}
    >
      <Stack.Screen name="SelecionarPerfilScreen" component={SelecionarPerfilScreen} />
      <Stack.Screen name="PerfilScreen" component={PerfilScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ListaComprasScreen" component={ListaComprasScreen} />
      <Stack.Screen name="HistoricoScreen" component={HistoricoScreen} />
    </Stack.Navigator>
  );
}