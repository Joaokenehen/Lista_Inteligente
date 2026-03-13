import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Info, Code, Rocket } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';

export function SobreScreen() {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-green-600 pt-16 pb-6 px-6 flex-row items-center shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2 mr-2">
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Sobre o App</Text>
      </View>

      <View className="flex-1 px-6 pt-10 items-center">
        <View className="bg-green-100 p-5 rounded-full mb-4 shadow-sm">
          <Info size={48} color="#16a34a" />
        </View>
        
        <Text className="text-3xl font-black text-slate-800 mb-1">CartFlow</Text>
        <Text className="text-slate-500 font-medium mb-10">Lista Inteligente • Versão 1.0.0</Text>

        <View className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-4">
          <View className="flex-row items-center mb-4">
            <Code size={24} color="#3b82f6" className="mr-3" />
            <Text className="text-lg font-bold text-slate-800">Desenvolvedor</Text>
          </View>
          <Text className="text-slate-700 text-base font-bold">João Gustavo Quennehen</Text>
          <Text className="text-slate-400 text-sm mt-1">Engenheiro de Software</Text>
        </View>

        <View className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <View className="flex-row items-center mb-4">
            <Rocket size={24} color="#8b5cf6" className="mr-3" />
            <Text className="text-lg font-bold text-slate-800">Empresa</Text>
          </View>
          <Text className="text-slate-700 text-base font-bold">JGTechBrasil</Text>
          <Text className="text-slate-400 text-sm mt-1">Soluções em Tecnologia e Hardware</Text>
        </View>
      </View>

      <View className="pb-8 items-center">
        <Text className="text-slate-400 text-xs font-medium">© 2026 JGTechBrasil. Todos os direitos reservados.</Text>
      </View>
    </View>
  );
}