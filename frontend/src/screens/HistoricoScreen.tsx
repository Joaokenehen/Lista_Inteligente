import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, ShoppingBag, Calendar, Trash2 } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';

interface CompraHistorico {
  id: string;
  data: string;
  total: number;
  itens: any[];
}

export function HistoricoScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [historico, setHistorico] = useState<CompraHistorico[]>([]);

  // Atualiza a lista sempre que a tela for aberta
  useFocusEffect(
    React.useCallback(() => {
      carregarHistorico();
    }, [])
  );

  async function carregarHistorico() {
    try {
      const dados = await AsyncStorage.getItem('@Lista-inteligente:historico');
      if (dados) {
        setHistorico(JSON.parse(dados));
      }
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  }

  // Função extra para limpar o histórico caso queiram "recomeçar" o mês
  async function limparHistorico() {
    await AsyncStorage.removeItem('@Lista-inteligente:historico');
    setHistorico([]);
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Cabeçalho Azul */}
      <View className="bg-blue-600 pt-16 pb-6 px-6 flex-row items-center justify-between shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Histórico de Gastos</Text>
        <TouchableOpacity onPress={limparHistorico} className="p-2">
          <Trash2 color="#bfdbfe" size={24} />
        </TouchableOpacity>
      </View>

      {/* Resumo do Mês (Para já, soma tudo) */}
      <View className="px-6 py-6 border-b border-slate-200 bg-white shadow-sm z-10">
        <Text className="text-slate-500 font-medium mb-1">Total acumulado</Text>
        <Text className="text-blue-700 text-4xl font-black">
          R$ {historico.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
        </Text>
      </View>

      {/* Lista de Compras Anteriores */}
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-20 opacity-60">
            <ShoppingBag color="#64748b" size={64} className="mb-4" />
            <Text className="text-slate-500 text-lg font-medium text-center">
              Nenhuma compra finalizada ainda.
            </Text>
            <Text className="text-slate-400 text-center mt-2">
              Vá ao mercado e finalize uma compra para vê-la aqui.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-3xl mb-4 shadow-sm border border-slate-100 flex-row justify-between items-center">
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 p-4 rounded-2xl">
                <Calendar color="#2563eb" size={24} />
              </View>
              <View>
                <Text className="text-slate-800 font-bold text-lg">{item.data}</Text>
                <Text className="text-slate-500 text-sm">{item.itens.length} itens comprados</Text>
              </View>
            </View>
            <Text className="text-slate-900 font-black text-xl">R$ {item.total.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}