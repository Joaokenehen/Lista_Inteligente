import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, ShoppingBag, Calendar, Trash2, CheckCircle2, Circle, CheckSquare } from 'lucide-react-native';
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
  const [modoExclusao, setModoExclusao] = useState(false);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarHistorico();
      setModoExclusao(false);
      setSelecionados([]);
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

  const alternarSelecao = (id: string) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(item => item !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  const selecionarTodos = () => {
    if (selecionados.length === historico.length) {
      setSelecionados([]);
    } else {
      setSelecionados(historico.map(h => h.id));
    }
  };

  const confirmarExclusao = () => {
    if (selecionados.length === 0) {
      setModoExclusao(false);
      return;
    }

    Alert.alert(
      "Excluir Compras",
      `Tem certeza que deseja apagar ${selecionados.length} compra(s)? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: executarExclusao 
        }
      ]
    );
  };

  const executarExclusao = async () => {
    const novoHistorico = historico.filter(h => !selecionados.includes(h.id));
    setHistorico(novoHistorico);
    setSelecionados([]);
    setModoExclusao(false);
    await AsyncStorage.setItem('@Lista-inteligente:historico', JSON.stringify(novoHistorico));
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className={`${modoExclusao ? 'bg-red-600' : 'bg-blue-600'} pt-16 pb-6 px-6 flex-row items-center justify-between shadow-md`}>
        {modoExclusao ? (
          <TouchableOpacity onPress={() => { setModoExclusao(false); setSelecionados([]); }} className="p-2 -ml-2">
            <Text className="text-white font-medium text-lg">Cancelar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <ChevronLeft color="white" size={28} />
          </TouchableOpacity>
        )}
        
        <Text className="text-white text-xl font-bold">
          {modoExclusao ? `${selecionados.length} selecionados` : 'Histórico de Gastos'}
        </Text>

        {modoExclusao ? (
          <TouchableOpacity onPress={confirmarExclusao} className="p-2">
            <Trash2 color="white" size={24} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setModoExclusao(true)} className="p-2">
            <Trash2 color="#bfdbfe" size={24} />
          </TouchableOpacity>
        )}
      </View>

      {modoExclusao && historico.length > 0 && (
        <TouchableOpacity 
          onPress={selecionarTodos}
          className="bg-red-50 px-6 py-4 flex-row items-center justify-between border-b border-red-100"
        >
          <Text className="text-red-700 font-bold">Selecionar Todos</Text>
          {selecionados.length === historico.length ? (
            <CheckSquare color="#b91c1c" size={24} />
          ) : (
            <Circle color="#fca5a5" size={24} />
          )}
        </TouchableOpacity>
      )}

      {!modoExclusao && (
        <View className="px-6 py-6 border-b border-slate-200 bg-white shadow-sm z-10">
          <Text className="text-slate-500 font-medium mb-1">Total acumulado</Text>
          <Text className="text-blue-700 text-4xl font-black">
            R$ {historico.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}
          </Text>
        </View>
      )}

      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-20 opacity-60">
            <ShoppingBag color="#64748b" size={64} className="mb-4" />
            <Text className="text-slate-500 text-lg font-medium text-center">Nenhuma compra no histórico.</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isSelecionado = selecionados.includes(item.id);

          return (
            <TouchableOpacity 
              activeOpacity={modoExclusao ? 0.7 : 1}
              onPress={() => modoExclusao ? alternarSelecao(item.id) : null}
              onLongPress={() => {
                if (!modoExclusao) {
                  setModoExclusao(true);
                  alternarSelecao(item.id);
                }
              }}
              className={`bg-white p-5 rounded-3xl mb-4 shadow-sm border flex-row justify-between items-center ${isSelecionado ? 'border-red-400 bg-red-50' : 'border-slate-100'}`}
            >
              <View className="flex-row items-center gap-4 flex-1">
                {modoExclusao && (
                  <View className="mr-2">
                    {isSelecionado ? <CheckCircle2 color="#ef4444" size={24} /> : <Circle color="#cbd5e1" size={24} />}
                  </View>
                )}
                
                <View className={`${modoExclusao ? 'bg-red-100' : 'bg-blue-50'} p-4 rounded-2xl`}>
                  <Calendar color={modoExclusao ? "#ef4444" : "#2563eb"} size={24} />
                </View>
                <View>
                  <Text className="text-slate-800 font-bold text-lg">{item.data}</Text>
                  <Text className="text-slate-500 text-sm">{item.itens.length} itens comprados</Text>
                </View>
              </View>
              <Text className="text-slate-900 font-black text-xl">R$ {item.total.toFixed(2)}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}