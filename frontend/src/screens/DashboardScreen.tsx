import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Tipagem da navegação
type AuthStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Registrar: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export function DashboardScreen() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="flex-1 items-center justify-center bg-green-50 px-6">
      <View className="mb-10 w-full items-center">
        <Image
          source={require('../assets/dashboardCartFlow.png')}
          accessibilityLabel="CartFlow - Lista Inteligente"
          resizeMode="contain"
          className="h-56 w-full"
        />
        <Text className="mt-4 px-4 text-center text-base text-green-900">
          Organize as suas listas de compras de forma inteligente e sincronizada.
        </Text>
      </View>

      <View className="w-full">
        <TouchableOpacity
          className="mb-4 w-full items-center rounded-2xl bg-green-700 py-4 shadow-sm"
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text className="text-white font-bold text-lg">Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full items-center rounded-2xl border-2 border-green-700 bg-white py-4"
          onPress={() => navigation.navigate('Registrar')}
          activeOpacity={0.85}
        >
          <Text className="text-lg font-bold text-green-800">Criar Nova Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}