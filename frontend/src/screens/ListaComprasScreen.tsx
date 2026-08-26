import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Plus, ShoppingBag, Minus, Trash, Pencil } from 'lucide-react-native';
import { ProdutoCard } from '../components/ProdutoCard';
import { AppNavigationProp, RootStackParamList } from '../types/navigation';
import { ItemPlanejado, ListaAtiva, ComprasHistorico, ListaItem } from '../types/shopping';
import { CampoMoeda } from '@/components/CampoMoeda';

type ListaComprasRouteProp = RouteProp<RootStackParamList, 'ListaComprasScreen'>;

export function ListaComprasScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const route = useRoute<ListaComprasRouteProp>();
  const { listaId } = route.params;
  const [listaAtual, setListaAtual] = useState<ListaAtiva | null>(null);
  const [itens, setItens] = useState<ItemPlanejado[]>([]);
  const [nomeNovoItem, setNomeNovoItem] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemPlanejado | null>(null);
  const [precoDigitado, setPrecoDigitado] = useState('');
  const [quantidadeDigitada, setQuantidadeDigitada] = useState(1);
  const [nomeEditado, setNomeEditado] = useState('');
  const [modalEdicaoListaVisivel, setModalEdicaoListaVisivel] = useState(false);
  const [nomeListaEditado, setNomeListaEditado] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      carregarLista();
    }, [listaId])
  );

  const carregarLista = async () => {
    try {
      const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
      if (listasSalvas) {
        const listasAtuais: ListaAtiva[] = JSON.parse(listasSalvas);
        const listaEncontrada = listasAtuais.find(l => l.id === listaId);
        
        if (listaEncontrada) {
          setListaAtual(listaEncontrada);
          // Garante que todos os itens tenham um ID para evitar o bug de undefined === undefined
          const itensSeguros = (listaEncontrada.itens || []).map(item => ({
            ...item,
            id: item.id || Date.now().toString() + Math.random().toString(36).substring(2, 9)
          }));
          setItens(itensSeguros);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar lista", error);
    }
  };

  const atualizarListaLocal = async (novaListaItens: ItemPlanejado[]) => {
    setItens(novaListaItens);
    
    try {
      const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
      if (listasSalvas) {
        let listasAtuais: ListaAtiva[] = JSON.parse(listasSalvas);
        listasAtuais = listasAtuais.map(l =>
          l.id === listaId ? { ...l, itens: novaListaItens } : l
        );
        await AsyncStorage.setItem("@Lista-inteligente:listasAtivas", JSON.stringify(listasAtuais));
      }
    } catch (error) {
      console.error("Erro ao salvar progresso", error);
    }
  };

  const faltamPegar = itens.filter(i => !i.comprado);
  const noCarrinho = itens.filter(i => i.comprado);
  const totalCarrinho = noCarrinho.reduce((acc, item) => acc + (item.preco * (item.quantidade || 1)), 0);

  const handleAdicionarItem = () => {
    if (!nomeNovoItem.trim()) return;
    const novoProduto: ItemPlanejado = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      nome: nomeNovoItem.trim(),
      preco: 0,
      comprado: false,
      quantidade: 1
    };
    
    atualizarListaLocal([...itens, novoProduto]);
    setNomeNovoItem('');
  };

  const abrirModalPreco = (item: ItemPlanejado) => {
    setItemSelecionado(item);
    setNomeEditado(item.nome);

    if (item.preco > 0) {  
      const precoFormatado = item.preco.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      setPrecoDigitado(precoFormatado);
    } else {
      setPrecoDigitado('');
    }

    setQuantidadeDigitada(item.quantidade || 1);
    setModalVisivel(true);
  };

  const confirmarPreco = () => {
    if (!itemSelecionado) return;
    
    if (!nomeEditado.trim()) {
      Alert.alert("Aviso", "O nome do produto não pode estar vazio.");
      return;
    }

    const precoLimpo = precoDigitado.trim().replace(/\./g, '').replace(',', '.');
    const precoNum = parseFloat(precoLimpo);
    const temPrecoValido = !isNaN(precoNum) && precoNum > 0;

    const novaLista = itens.map(i =>
      i.id === itemSelecionado.id ? { 
        ...i, 
        nome: nomeEditado.trim(), 
        quantidade: quantidadeDigitada, 
        preco: temPrecoValido ? precoNum : 0, 
        comprado: temPrecoValido ? true : false 
      } : i
    );
    
    atualizarListaLocal(novaLista);
    setModalVisivel(false);
    setItemSelecionado(null);
  };

  const desmarcarItem = (id: string) => {
    const novaLista = itens.map(i =>
      i.id === id ? { ...i, preco: 0, comprado: false } : i
    );
    atualizarListaLocal(novaLista);
  };

  const confirmarDesmarcar = (item: ItemPlanejado) => {
    Alert.alert(
      "O que deseja fazer?",
      `Produto: ${item.nome}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Editar Item", onPress: () => abrirModalPreco(item) },
        { text: "Tirar do Carrinho", style: "destructive", onPress: () => desmarcarItem(item.id) }
      ]
    );
  };

  const confirmarRemocao = (id: string) => {
    Alert.alert(
      "Remover Item",
      "Tem certeza que deseja apagar este item da lista?",
      [
        { text: "Não, manter", style: "cancel" },
        { text: "Sim, apagar", style: "destructive", onPress: () => removerItem(id) }
      ]
    );
  };

  const removerItem = (id: string) => {
    const novaLista = itens.filter(i => i.id !== id);
    atualizarListaLocal(novaLista);
  };

  const handleFinalizarCompra = async () => {
    if (noCarrinho.length === 0) {
      Alert.alert("Aviso", "O seu carrinho está vazio! Bipe pelo menos um item.");
      return;
    }

    try {
      const itensParaHistorico: ListaItem[] = noCarrinho.map(item => ({
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
        foiComprado: item.comprado
      }));

      const novaCompra: ComprasHistorico = {
        id: Date.now().toString(),
        data: new Date().toLocaleDateString('pt-BR'),
        valorTotal: totalCarrinho,
        itens: itensParaHistorico
      };

      const historicoSalvo = await AsyncStorage.getItem('@Lista-inteligente:historico');
      const historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
      historico.unshift(novaCompra);
      await AsyncStorage.setItem('@Lista-inteligente:historico', JSON.stringify(historico));

      const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
      if (listasSalvas) {
        let listasAtuais: ListaAtiva[] = JSON.parse(listasSalvas);
        
        if (faltamPegar.length === 0) {
          listasAtuais = listasAtuais.filter(l => l.id !== listaId);
        } else {
          listasAtuais = listasAtuais.map(l =>
            l.id === listaId ? { ...l, itens: faltamPegar } : l
          );
        }
        await AsyncStorage.setItem("@Lista-inteligente:listasAtivas", JSON.stringify(listasAtuais));
      }

      Alert.alert(
        "Compra Finalizada! 🎉", 
        `Você gastou R$ ${totalCarrinho.toFixed(2)} nesta compra.`,
        [{ text: "OK", onPress: () => navigation.navigate('HomeScreen') }]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar a compra.");
    }
  };

  const confirmarExclusaoLista = () => {
    Alert.alert(
      "Excluir Lista",
      "Tem certeza que deseja excluir esta lista inteira? Isso não pode ser desfeito.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Excluir", style: "destructive", onPress: excluirLista }
      ]
    );
  };

  const excluirLista = async () => {
    try {
      const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
      if (listasSalvas) {
        let listasAtuais: ListaAtiva[] = JSON.parse(listasSalvas);
        listasAtuais = listasAtuais.filter(l => l.id !== listaId);
        await AsyncStorage.setItem("@Lista-inteligente:listasAtivas", JSON.stringify(listasAtuais));
        navigation.goBack(); // Volta para a tela inicial
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a lista.");
    }
  };

  const salvarNomeLista = async () => {
    if (!nomeListaEditado.trim()) {
      Alert.alert("Aviso", "O nome da lista não pode ficar vazio.");
      return;
    }
    try {
      const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
      if (listasSalvas) {
        let listasAtuais: ListaAtiva[] = JSON.parse(listasSalvas);
        listasAtuais = listasAtuais.map(l => l.id === listaId ? { ...l, nome: nomeListaEditado.trim() } : l);
        await AsyncStorage.setItem("@Lista-inteligente:listasAtivas", JSON.stringify(listasAtuais));
        setListaAtual(prev => prev ? { ...prev, nome: nomeListaEditado.trim() } : null);
        setModalEdicaoListaVisivel(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível renomear a lista.");
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
        <Text className="text-white text-xl font-bold flex-1 text-center mx-2" numberOfLines={1}>
          {listaAtual?.nome || "Mercado"}
        </Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => { setNomeListaEditado(listaAtual?.nome || ''); setModalEdicaoListaVisivel(true); }}>
            <Pencil color="white" size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmarExclusaoLista}>
            <Trash color="white" size={22} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-4 bg-white border-b border-slate-200 flex-row gap-3">
        <TextInput 
          placeholder="Pegou algo fora da lista?"
          className="flex-1 bg-slate-100 px-5 py-4 rounded-2xl text-slate-800 text-base"
          value={nomeNovoItem}
          onChangeText={setNomeNovoItem}
          onSubmitEditing={handleAdicionarItem}
          maxLength={45}
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
            item={item as any}
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
            item={item as any}
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
              Detalhes do Item
            </Text>
            
            <Text className="text-slate-700 font-bold mb-2">Nome do Produto</Text>
            <TextInput 
              placeholder="Nome do item"
              className="bg-slate-100 p-4 rounded-2xl text-slate-800 font-medium mb-4"
              value={nomeEditado}
              onChangeText={setNomeEditado}
              maxLength={45}
            />
            
            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Text className="text-slate-700 font-bold mb-2">Preço Unitário</Text>
                <CampoMoeda
                  placeholder="0,00"
                  className="bg-slate-100 p-4 rounded-2xl text-center text-xl font-bold text-slate-800"
                  valor={precoDigitado}
                  aoMudarTexto={setPrecoDigitado}
                  maxLength={14} // Aumentado um pouco para não cortar valores mais altos com a máscara
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

      {/* Modal Editar Nome Lista */}
      <Modal visible={modalEdicaoListaVisivel} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-[32px] shadow-2xl">
            <Text className="text-slate-900 text-xl font-bold mb-6 text-center">
              Renomear Lista
            </Text>
            
            <Text className="text-slate-700 font-bold mb-2">Nome da Lista</Text>
            <TextInput 
              placeholder="Ex: Compras do Mês"
              className="bg-slate-100 p-4 rounded-2xl text-slate-800 font-medium mb-6 text-base"
              value={nomeListaEditado}
              onChangeText={setNomeListaEditado}
              maxLength={40}
              autoFocus
            />
            
            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setModalEdicaoListaVisivel(false)}
                className="flex-1 bg-slate-200 p-4 rounded-2xl items-center"
              >
                <Text className="text-slate-600 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={salvarNomeLista}
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