import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerfilCard } from '../components/PerfilCard';
import { Plus } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';

export function SelecionarPerfilScreen() {
  const [perfis, setPerfis] = useState<string[]>([]);
  const navigation = useNavigation<AppNavigationProp>();

  // Atualiza a lista sempre que entrar nesta tela
  useFocusEffect(
    React.useCallback(() => {
      async function carregarPerfils() {
        const data = await AsyncStorage.getItem('@Lista-inteligente:perfis');
        if (data) setPerfis(JSON.parse(data));
      }
      carregarPerfils();
    }, [])
  );

  const handleSelect = async (nome: string) => {
    // Define o perfil atual ao clicar no card
    await AsyncStorage.setItem('@Lista-inteligente:perfilAtual', nome);
    navigation.navigate('HomeScreen');
  };

  return (
    <View className="flex-1 bg-slate-50 px-6 pt-20">
      <Text className="text-slate-900 text-3xl font-black mb-2 text-center">
        Quem vai às compras?
      </Text>
      <Text className="text-slate-500 text-center mb-10">Escolha seu perfil ou crie um novo</Text>

      <FlatList
        data={perfis}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <PerfilCard nome={item} onPress={() => handleSelect(item)} />
        )}
        ListFooterComponent={() => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('PerfilScreen')}
            className="bg-green-600 p-6 rounded-3xl flex-row items-center justify-center mt-4 shadow-lg"
          >
            <Plus color="white" size={24} />
            <Text className="text-white font-bold ml-2 text-lg">Novo Perfil</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}