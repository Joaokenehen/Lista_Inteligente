import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    HomeScreen: undefined;
    ListaComprasScreen: undefined;
    HistoricoScreen: { date: string} | undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
