import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Plus, Save, Trash2, Minus } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';
import { ItemPlanejado, ListaAtiva } from '../types/shopping';

export function PlanejamentoScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [nomeLista, setNomeLista] = useState('');
  const [nomeItem, setNomeItem] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [itens, setItens] = useState<ItemPlanejado[]>([]);

  const handleAdicionarItem = () => {
    if (!nomeItem.trim()) return;
    
    const novoItem: ItemPlanejado = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      nome: nomeItem.trim(),
      quantidade: quantidade,
      comprado: false,
      preco: 0
    };

    setItens([...itens, novoItem]);
    setNomeItem('');
    setQuantidade(1);
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(i => i.id !== id));
  };

  const handleSalvarLista = async () => {
    if (!nomeLista.trim()) {
      Alert.alert("Aviso", "Dê um nome para sua lista (ex: Compra da Semana)");
      return;
    }

    if (itens.length === 0) {
      Alert.alert("Aviso", "Adicione pelo menos um item à lista.");
      return;
    }

    try {
      const novaLista = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        nome: nomeLista.trim(),
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        itens: itens
      };

      // Busca o que já existe
      const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
      const listasAtuais = listasSalvas ? JSON.parse(listasSalvas) : [];
      
      listasAtuais.unshift(novaLista);
      
      await AsyncStorage.setItem("@Lista-inteligente:listasAtivas", JSON.stringify(listasAtuais));
      
      Alert.alert("Sucesso!", "Lista salva e pronta para o mercado.");
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a lista.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      {/* Cabeçalho */}
      <View className="bg-green-600 pt-16 pb-6 px-6 flex-row items-center justify-between shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Planejar Compras</Text>
        <TouchableOpacity onPress={handleSalvarLista} className="p-2 -mr-2">
          <Save color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Nome da Lista */}
        <View className="mb-6">
          <Text className="text-slate-500 font-bold uppercase text-xs mb-2 ml-1">Nome da Lista</Text>
          <TextInput 
            placeholder="Ex: Mercado do Mês"
            className="bg-white p-4 rounded-2xl text-slate-800 text-lg border border-slate-200 shadow-sm"
            value={nomeLista}
            onChangeText={setNomeLista}
            maxLength={40}
          />
        </View>

        {/* Adicionar Itens */}
        <View className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm mb-6">
          <Text className="text-slate-800 font-bold text-lg mb-4">Adicionar Itens</Text>
          
          <TextInput 
            placeholder="O que você precisa?"
            className="bg-slate-100 p-4 rounded-xl text-slate-800 mb-4"
            value={nomeItem}
            onChangeText={setNomeItem}
            maxLength={45}
          />

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-600 font-medium">Quantidade:</Text>
            <View className="flex-row items-center bg-slate-100 rounded-xl p-1">
              <TouchableOpacity 
                onPress={() => setQuantidade(prev => Math.max(1, prev - 1))}
                className="bg-white p-2 rounded-lg"
              >
                <Minus size={20} color="#64748b" />
              </TouchableOpacity>
              <Text className="px-4 font-bold text-lg text-slate-800">{quantidade}</Text>
              <TouchableOpacity 
                onPress={() => setQuantidade(prev => prev + 1)}
                className="bg-white p-2 rounded-lg"
              >
                <Plus size={20} color="#16a34a" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleAdicionarItem}
            className="bg-green-600 p-4 rounded-xl items-center flex-row justify-center"
          >
            <Plus color="white" size={20} />
            <Text className="text-white font-bold ml-2">Incluir na Lista</Text>
          </TouchableOpacity>
        </View>

        {/* Listagem de Itens Planejados */}
        <Text className="text-slate-500 font-bold uppercase text-xs mb-3 ml-1">
          Itens na Lista ({itens.length})
        </Text>

        {itens.map((item) => (
          <View key={item.id} className="bg-white p-4 rounded-2xl mb-2 flex-row items-center border border-slate-100 shadow-sm">
            <View className="bg-slate-100 px-3 py-1 rounded-lg mr-3">
              <Text className="text-slate-800 font-bold">{item.quantidade}x</Text>
            </View>
            <Text className="flex-1 text-slate-800 font-medium text-base">{item.nome}</Text>
            <TouchableOpacity onPress={() => removerItem(item.id)}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        
        <View className="h-20" />
      </ScrollView>

      {/* Botão Flutuante de Salvar */}
      <View className="px-6 pb-10 pt-4 bg-slate-50">
        <TouchableOpacity 
          onPress={handleSalvarLista}
          className="bg-green-600 p-5 rounded-3xl items-center shadow-xl shadow-green-200"
        >
          <Text className="text-white font-black text-lg">SALVAR LISTA ATIVA</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}