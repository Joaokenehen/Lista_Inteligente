import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    SelecionarPerfilScreen: undefined;
    PerfilScreen: undefined;
    HomeScreen: undefined;
    ListaComprasScreen: undefined;
    HistoricoScreen: { date: string} | undefined;
    SobreScreen: undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
