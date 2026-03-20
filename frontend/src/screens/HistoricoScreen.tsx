import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, ShoppingBag, Trash2, Circle, CheckSquare } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';
import { HistoricoCard, CompraHistorico } from '../components/HistoricoCard';

export function HistoricoScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [historico, setHistorico] = useState<CompraHistorico[]>([]);
  const [modoExclusao, setModoExclusao] = useState(false);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [compraSelecionada, setCompraSelecionada] = useState<CompraHistorico | null>(null);

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

  const abrirDetalhes = (compra: CompraHistorico) => {
    setCompraSelecionada(compra);
    setModalVisivel(true);
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
            <HistoricoCard
              item={item}
              modoExclusao={modoExclusao}
              isSelecionado={isSelecionado}
              onPress={() => modoExclusao ? alternarSelecao(item.id) : abrirDetalhes(item)}
              onLongPress={() => {
                if (!modoExclusao) {
                  setModoExclusao(true);
                  alternarSelecao(item.id);
                }
              }}
            />
          );
        }}
      />
      
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-[32px] shadow-2xl max-h-[80%]">
            <Text className="text-slate-900 text-xl font-bold mb-1 text-center">
              Detalhes da Compra
            </Text>
            <Text className="text-slate-500 text-center mb-6">
              {compraSelecionada?.data} - R$ {compraSelecionada?.total.toFixed(2)}
            </Text>
            
            <FlatList
              data={compraSelecionada?.itens}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-slate-800">{item.nome}</Text>
                  <Text className="text-slate-800">R$ {item.preco.toFixed(2)}</Text>
                </View>
              )}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setModalVisivel(false)}
                className="flex-1 bg-blue-600 p-4 rounded-2xl items-center mt-4"
              >
                <Text className="text-white font-bold text-lg">Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}