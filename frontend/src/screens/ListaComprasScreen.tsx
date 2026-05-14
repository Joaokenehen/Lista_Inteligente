import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Plus, ShoppingBag, Minus, Trash } from 'lucide-react-native';
import { ProdutoCard, Produto } from '../components/ProdutoCard';

export function ListaComprasScreen() {
  const navigation = useNavigation();
  const [itens, setItens] = useState<Produto[]>([]);
  const [nomeNovoItem, setNomeNovoItem] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Produto | null>(null);
  const [precoDigitado, setPrecoDigitado] = useState('');
  const [quantidadeDigitada, setQuantidadeDigitada] = useState(1);
  const [nomeEditado, setNomeEditado] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      carregarListaPendente();
    }, [])
  );

  const carregarListaPendente = async () => {
    try {
      const dados = await AsyncStorage.getItem('@Lista-inteligente:listaAtual');
      if (dados) {
        setItens(JSON.parse(dados));
      }
    } catch (error) {
      console.error("Erro ao carregar lista pendente", error);
    }
  };

  const atualizarLista = async (novaLista: Produto[]) => {
    setItens(novaLista); // Atualiza a tela
    await AsyncStorage.setItem('@Lista-inteligente:listaAtual', JSON.stringify(novaLista)); // Salva no celular
  };

  const faltamPegar = itens.filter(i => !i.comprado);
  const noCarrinho = itens.filter(i => i.comprado);
  const totalCarrinho = noCarrinho.reduce((acc, item) => acc + (item.preco * (item.quantidade || 1)), 0);

  const handleAdicionarItem = () => {
    if (!nomeNovoItem.trim()) return;
    const novoProduto: Produto = {
      id: Date.now().toString(),
      nome: nomeNovoItem.trim(),
      preco: 0,
      comprado: false,
      quantidade: 1
    };
    
    atualizarLista([...itens, novoProduto]);
    setNomeNovoItem('');
  };

  const abrirModalPreco = (item: Produto) => {
    setItemSelecionado(item);
    setNomeEditado(item.nome);
    setPrecoDigitado('');
    setModalVisivel(true);
    setQuantidadeDigitada(item.quantidade || 1)
  };

  const confirmarPreco = () => {
    if (!itemSelecionado) return;

    if (!nomeEditado.trim()) {
      Alert.alert("Aviso", "O nome do produto não pode ficar vazio.");
      return;
    }

    const precoNum = parseFloat(precoDigitado.replace(',', '.'));
    
    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert("Aviso", "Por favor, digite um preço válido.");
      return;
    }

    const novaLista = itens.map(i =>
      i.id === itemSelecionado.id ? { ...i, nome: nomeEditado.trim(), preco: precoNum, quantidade: quantidadeDigitada, comprado: true } : i
    );
    
    atualizarLista(novaLista);
    setModalVisivel(false);
    setItemSelecionado(null);
  };

  const desmarcarItem = (id: string) => {
    const novaLista = itens.map(i =>
      i.id === id ? { ...i, preco: 0, comprado: false } : i
    );
    atualizarLista(novaLista);
  };

  const confirmarDesmarcar = (item: Produto) => {
      Alert.alert(
        "O que deseja fazer?",
        `Produto: ${item.nome}`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Editar Item", 
            onPress: () => abrirModalPreco(item) 
          },
          { 
            text: "Tirar do Carrinho", 
            style: "destructive",
            onPress: () => desmarcarItem(item.id) 
          }
        ]
      );
    };

  const confirmarRemocao = (id: string) => {
    Alert.alert(
      "Remover Item",
      "Tem certeza que deseja apagar este item da lista?",
      [
        { text: "Não, cancelar", style: "cancel" },
        { 
          text: "Sim, apagar", 
          style: "destructive", 
          onPress: () => removerItem(id) // Chama a função original de remover só se clicar em Sim
        }
      ]
    );
  };

  const removerItem = (id: string) => {
    const novaLista = itens.filter(i => i.id !== id);
    atualizarLista(novaLista);
  };

  const handleFinalizarCompra = async () => {
    if (noCarrinho.length === 0) {
      Alert.alert("Aviso", "O seu carrinho está vazio!");
      return;
    }

    try {
      const novaCompra = {
        id: Date.now().toString(),
        data: new Date().toLocaleDateString('pt-BR'),
        total: totalCarrinho,
        itens: noCarrinho
      };

      const historicoSalvo = await AsyncStorage.getItem('@Lista-inteligente:historico');
      const historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
      historico.unshift(novaCompra);
      await AsyncStorage.setItem('@Lista-inteligente:historico', JSON.stringify(historico));
      await atualizarLista(faltamPegar);

      Alert.alert(
        "Compra Finalizada! 🎉", 
        `Você gastou R$ ${totalCarrinho.toFixed(2)} nesta compra.`,
        [{ 
          text: "OK", 
          onPress: () => navigation.goBack() 
        }]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a compra no histórico.");
    }
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
          <ProdutoCard
            key={item.id}
            item={item}
            onPress={() => abrirModalPreco(item)}
            onRemove={() => confirmarRemocao(item.id)}
          />
        ))}

        <Text className="text-slate-500 font-bold mt-6 mb-3 uppercase text-sm ml-2">
          No Carrinho ({noCarrinho.length})
        </Text>
        
        {noCarrinho.map((item) => (
          <ProdutoCard
            key={item.id}
            item={item}
            onPress={() => confirmarDesmarcar(item)}
          />
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
            <Text className="text-slate-900 text-xl font-bold mb-6 text-center">
              Editar Item
            </Text>
            
            {/* ✨ NOVO: Campo para editar o nome do produto dentro do modal */}
            <Text className="text-slate-700 font-bold mb-2">Nome do Produto</Text>
            <TextInput 
              placeholder="Nome do item"
              className="bg-slate-100 p-4 rounded-2xl text-slate-800 font-medium mb-4"
              value={nomeEditado}
              onChangeText={setNomeEditado}
            />
            
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-slate-700 font-bold mb-2">Preço Unitário</Text>
                <TextInput 
                  placeholder="0,00"
                  keyboardType="numeric"
                  className="bg-slate-100 p-4 rounded-2xl text-center text-xl font-bold text-slate-800"
                  value={precoDigitado}
                  onChangeText={setPrecoDigitado}
                />
              </View>

              <View className="flex-1">
                <Text className="text-slate-700 font-bold mb-2 text-center">Qtd.</Text>
                <View className="flex-row items-center justify-between bg-slate-100 p-2 rounded-2xl">
                  <TouchableOpacity 
                    onPress={() => setQuantidadeDigitada(prev => Math.max(1, prev - 1))}
                    className="bg-white p-2 rounded-xl shadow-sm"
                  >
                    <Minus color="#64748b" size={20} />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-slate-800">{quantidadeDigitada}</Text>
                  <TouchableOpacity 
                    onPress={() => setQuantidadeDigitada(prev => prev + 1)}
                    className="bg-white p-2 rounded-xl shadow-sm"
                  >
                    <Plus color="#16a34a" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity 
                onPress={() => setModalVisivel(false)}
                className="flex-1 bg-slate-200 p-4 rounded-2xl items-center"
              >
                <Text className="text-slate-600 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={confirmarPreco}
                className="flex-1 bg-green-600 p-4 rounded-2xl items-center shadow-lg shadow-green-200"
              >
                <Text className="text-white font-bold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}