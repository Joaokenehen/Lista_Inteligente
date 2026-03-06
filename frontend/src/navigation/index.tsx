import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Importe suas telas
import { HomeScreen } from '../screens/HomeScreen';
import { ListaComprasScreen } from '../screens/ListaComprasScreen';
import { HistoricoScreen } from '../screens/HistoricoScreen';

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
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ShoppingList" component={ListaComprasScreen} />
      <Stack.Screen name="History" component={HistoricoScreen} />
    </Stack.Navigator>
  );
} // teste