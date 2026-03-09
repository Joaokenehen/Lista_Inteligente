import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../types/navigation';
import { ShoppingCart, History, PlusCircle, ArrowRight } from 'lucide-react-native';

export function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Cabeçalho Curvado com Gradiente Simulado */}
        <View className="bg-green-600 pt-16 pb-20 px-8 rounded-b-[50px] shadow-2xl">
          <Text className="text-green-100 text-lg font-medium">Lista Inteligente</Text>
          <Text className="text-white text-4xl font-bold mt-1">Olá, João! 👋</Text>
          <Text className="text-green-50 mt-2 opacity-80">Pronto para economizar hoje?</Text>
        </View>

        {/* Cards de Ação */}
        <View className="px-6 -mt-10">
          <TouchableOpacity 
            onPress={() => navigation.navigate('ListaComprasScreen')}
            activeOpacity={0.8}
            className="bg-white p-8 rounded-[32px] shadow-xl flex-row items-center border border-slate-100"
          >
            <View className="bg-green-100 p-4 rounded-2xl mr-4">
              <PlusCircle size={32} color="#16a34a" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 text-xl font-bold">Nova Compra</Text>
              <Text className="text-slate-500">Começar lista do zero</Text>
            </View>
            <ArrowRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <View className="flex-row mt-6 gap-4">
            <TouchableOpacity 
              onPress={() => navigation.navigate('HistoricoScreen')}
              className="flex-1 bg-white p-6 rounded-[32px] shadow-lg border border-slate-100 items-center"
            >
              <View className="bg-blue-100 p-3 rounded-xl mb-2">
                <History size={24} color="#2563eb" />
              </View>
              <Text className="text-slate-800 font-bold">Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-white p-6 rounded-[32px] shadow-lg border border-slate-100 items-center opacity-50">
              <View className="bg-purple-100 p-3 rounded-xl mb-2">
                <ShoppingCart size={24} color="#9333ea" />
              </View>
              <Text className="text-slate-800 font-bold">Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer/Dica */}
        <View className="mt-auto p-10 items-center">
          <Text className="text-slate-400 text-sm italic">"Economizar é comprar o que precisa."</Text>
        </View>
      </ScrollView>
    </View>
  );
}