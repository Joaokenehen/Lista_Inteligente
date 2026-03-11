import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Plus, CheckCircle2, Circle, Trash2, ShoppingBag } from 'lucide-react-native';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  comprado: boolean;
}

export function ListaComprasScreen() {
  const navigation = useNavigation();
  const [itens, setItens] = useState<Produto[]>([]);
  const [nomeNovoItem, setNomeNovoItem] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Produto | null>(null);
  const [precoDigitado, setPrecoDigitado] = useState('');

  const faltamPegar = itens.filter(i => !i.comprado);
  const noCarrinho = itens.filter(i => i.comprado);
  const totalCarrinho = noCarrinho.reduce((acc, item) => acc + item.preco, 0);

  const handleAdicionarItem = () => {
    if (!nomeNovoItem.trim()) return;
    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome: nomeNovoItem.trim(),
      preco: 0,
      comprado: false
    };
    setItens([...itens, novoProduto]);
    setNomeNovoItem('');
  };

  const abrirModalPreco = (item: Produto) => {
    setItemSelecionado(item);
    setPrecoDigitado('');
    setModalVisivel(true);
  };

  const confirmarPreco = () => {
    if (!itemSelecionado) return;
    const precoNum = parseFloat(precoDigitado.replace(',', '.'));
    
    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert("Aviso", "Por favor, digite um preço válido.");
      return;
    }

    setItens(itens.map(i =>
      i.id === itemSelecionado.id ? { ...i, preco: precoNum, comprado: true } : i
    ));
    setModalVisivel(false);
    setItemSelecionado(null);
  };

  const desmarcarItem = (id: string) => {
    setItens(itens.map(i =>
      i.id === id ? { ...i, preco: 0, comprado: false } : i
    ));
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(i => i.id !== id));
  };

  const handleFinalizarCompra = () => {
    if (noCarrinho.length === 0) {
      Alert.alert("Aviso", "O seu carrinho está vazio!");
      return;
    }

    Alert.alert(
      "Compra Finalizada! 🎉", 
      `Você gastou R$ ${totalCarrinho.toFixed(2)} nesta compra.`,
      [{ 
        text: "OK", 
        onPress: () => {
          setItens(faltamPegar); 
          navigation.goBack();
        } 
      }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <View className="bg-green-600 pt-16 pb-6 px-6 flex-row items-center justify-between shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Mercado</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View className="p-4 bg-white border-b border-slate-200 flex-row gap-3">
        <TextInput 
          placeholder="O que falta comprar? (ex: Leite)"
          className="flex-1 bg-slate-100 px-5 py-4 rounded-2xl text-slate-800 text-base"
          value={nomeNovoItem}
          onChangeText={setNomeNovoItem}
          onSubmitEditing={handleAdicionarItem}
        />
        <TouchableOpacity 
          onPress={handleAdicionarItem}
          className="bg-green-600 px-5 rounded-2xl items-center justify-center shadow-sm"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-slate-500 font-bold mb-3 uppercase text-sm ml-2">
          Faltam Pegar ({faltamPegar.length})
        </Text>
        
        {faltamPegar.map((item) => (
          <TouchableOpacity 
            key={item.id}
            onPress={() => abrirModalPreco(item)}
            className="bg-white p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm border border-slate-100"
          >
            <View className="flex-row items-center gap-3">
              <Circle color="#cbd5e1" size={24} />
              <Text className="text-slate-800 font-medium text-lg">{item.nome}</Text>
            </View>
            <TouchableOpacity onPress={() => removerItem(item.id)} className="p-2">
              <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <Text className="text-slate-500 font-bold mt-6 mb-3 uppercase text-sm ml-2">
          No Carrinho ({noCarrinho.length})
        </Text>
        
        {noCarrinho.map((item) => (
          <TouchableOpacity 
            key={item.id}
            onPress={() => desmarcarItem(item.id)}
            className="bg-green-50 p-4 rounded-2xl mb-3 flex-row justify-between items-center border border-green-200"
          >
            <View className="flex-row items-center gap-3">
              <CheckCircle2 color="#16a34a" size={24} />
              <Text className="text-slate-500 font-medium text-lg line-through">{item.nome}</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <Text className="text-green-700 font-bold text-lg">R$ {item.preco.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View className="h-20" />
      </ScrollView>

      <View className="p-6 bg-white border-t border-slate-200 flex-row items-center justify-between pb-8">
        <View>
          <Text className="text-slate-500 text-sm font-medium">Total da Compra</Text>
          <Text className="text-slate-900 text-3xl font-black">R$ {totalCarrinho.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleFinalizarCompra}
          className="bg-green-600 px-6 py-4 rounded-2xl flex-row items-center shadow-lg shadow-green-200"
        >
          <ShoppingBag color="white" size={20} className="mr-2" />
          <Text className="text-white font-bold ml-2">Finalizar</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-[32px] shadow-2xl">
            <Text className="text-slate-900 text-xl font-bold mb-1 text-center">
              Qual o preço?
            </Text>
            <Text className="text-slate-500 text-center mb-6">
              {itemSelecionado?.nome}
            </Text>
            
            <TextInput 
              placeholder="R$ 0,00"
              keyboardType="numeric"
              className="bg-slate-100 p-5 rounded-2xl text-center text-2xl font-bold text-slate-800 mb-6"
              value={precoDigitado}
              onChangeText={setPrecoDigitado}
              autoFocus
            />

            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setModalVisivel(false)}
                className="flex-1 bg-slate-100 p-4 rounded-2xl items-center"
              >
                <Text className="text-slate-600 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={confirmarPreco}
                className="flex-1 bg-green-600 p-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold">Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}