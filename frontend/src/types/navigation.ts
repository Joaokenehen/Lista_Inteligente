import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Home: undefined;
    ShoppingList: undefined;
    History: { date: string} | undefined;
};

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
