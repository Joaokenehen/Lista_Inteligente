import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerfilCard } from '../components/PerfilCard';
import { Plus } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';
import { renomearDadosDoPerfil, removerDadosDoPerfil } from '../services/dadosPerfil';

export function SelecionarPerfilScreen() {
  const [perfis, setPerfis] = useState<string[]>([]);
  const navigation = useNavigation<AppNavigationProp>();
  const [modalVisivel, setModalVisivel] = useState(false);
  const [perfilEditando, setPerfilEditando] = useState('');
  const [novoNome, setNovoNome] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      carregarPerfils();
    }, [])
  );

  async function carregarPerfils() {
    try {
      const data = await AsyncStorage.getItem('@Lista-inteligente:perfis');
      const perfisSalvos: string[] = data ? JSON.parse(data) : [];
      setPerfis(perfisSalvos);

      if (perfisSalvos.length === 0) {
        navigation.replace('PerfilScreen');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os perfis salvos.');
    }
  }

  const handleSelect = async (nome: string) => {
    await AsyncStorage.setItem('@Lista-inteligente:perfilAtual', nome);
    navigation.navigate('HomeScreen');
  };

  const abrirModalEdicao = (nome: string) => {
    setPerfilEditando(nome);
    setNovoNome(nome);
    setModalVisivel(true);
  };

  const salvarEdicao = async () => {
    if (!novoNome.trim()) {
      Alert.alert("Erro", "O nome não pode ser vazio.");
      return;
    }

    // Se não mudou nada, só fecha
    if (novoNome.trim() === perfilEditando) {
      setModalVisivel(false);
      return;
    }

    const nomeNormalizado = novoNome.trim().normalize('NFC').toLocaleLowerCase('pt-BR');
    const nomeJaExiste = perfis.some(
      perfil => perfil !== perfilEditando &&
        perfil.trim().normalize('NFC').toLocaleLowerCase('pt-BR') === nomeNormalizado
    );

    if (nomeJaExiste) {
      Alert.alert("Erro", "Este perfil já existe.");
      return;
    }

    // Substitui o nome antigo pelo novo
    const novaLista = perfis.map(p => p === perfilEditando ? novoNome.trim() : p);
    await renomearDadosDoPerfil(perfilEditando, novoNome.trim());
    await AsyncStorage.setItem('@Lista-inteligente:perfis', JSON.stringify(novaLista));
    
    // Se o usuário editado era o logado, atualiza o atual também
    const perfilAtual = await AsyncStorage.getItem('@Lista-inteligente:perfilAtual');
    if (perfilAtual === perfilEditando) {
      await AsyncStorage.setItem('@Lista-inteligente:perfilAtual', novoNome.trim());
    }

    setPerfis(novaLista);
    setModalVisivel(false);
  };

  const excluirPerfil = () => {
    Alert.alert(
      "Excluir Perfil", 
      `Tem certeza que deseja apagar "${perfilEditando}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            const novaLista = perfis.filter(p => p !== perfilEditando);
            await removerDadosDoPerfil(perfilEditando);
            await AsyncStorage.setItem('@Lista-inteligente:perfis', JSON.stringify(novaLista));
            setPerfis(novaLista);
            setModalVisivel(false);
          }
        }
      ]
    );
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
          <PerfilCard 
            nome={item} 
            onPress={() => handleSelect(item)} 
            onEdit={() => abrirModalEdicao(item)}
          />
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

      {/* Modal de Edição */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white w-full p-6 rounded-[32px] shadow-2xl">
            <Text className="text-slate-900 text-xl font-bold mb-4 text-center">
              Editar Perfil
            </Text>
            
            <TextInput 
              className="bg-slate-100 p-5 rounded-2xl text-lg font-medium text-slate-800 mb-6"
              value={novoNome}
              onChangeText={setNovoNome}
              maxLength={20}
              autoFocus
            />

            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity 
                onPress={() => setModalVisivel(false)}
                className="flex-1 bg-slate-100 p-4 rounded-2xl items-center"
              >
                <Text className="text-slate-600 font-bold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={salvarEdicao}
                className="flex-1 bg-green-600 p-4 rounded-2xl items-center"
              >
                <Text className="text-white font-bold">Salvar</Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Excluir */}
            <TouchableOpacity 
              onPress={excluirPerfil}
              className="p-4 rounded-2xl items-center border border-red-200 bg-red-50 mt-2"
            >
              <Text className="text-red-600 font-bold">Excluir Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
