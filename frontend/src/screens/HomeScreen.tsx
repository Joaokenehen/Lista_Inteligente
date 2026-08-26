import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AppNavigationProp } from '../types/navigation';
import { History, PlusCircle, ArrowRight, Users, Info, ShoppingCart } from 'lucide-react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [listasAtivas, setListasAtivas] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      async function carregarDados() {
        try {
          const nomeSalvo = await AsyncStorage.getItem("@Lista-inteligente:perfilAtual");
          if (nomeSalvo) {
            setNomeUsuario(nomeSalvo);
          }

          // ✨ NOVO: Busca as listas criadas no AsyncStorage
          const listasSalvas = await AsyncStorage.getItem("@Lista-inteligente:listasAtivas");
          if (listasSalvas) {
            let listasParsed = JSON.parse(listasSalvas);
            
            let precisouCorrigir = false;
            listasParsed = listasParsed.map((l: any) => {
              if (!l.id) {
                precisouCorrigir = true;
                return { ...l, id: Date.now().toString() + Math.random().toString(36).substring(2, 9) };
              }
              return l;
            });
            if (precisouCorrigir) await AsyncStorage.setItem("@Lista-inteligente:listasAtivas", JSON.stringify(listasParsed));
            
            setListasAtivas(listasParsed);
          } else {
            setListasAtivas([]);
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      }
      
      carregarDados();
    }, [])
  );

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="bg-green-600 pt-16 pb-20 px-8 rounded-b-[50px] shadow-2xl flex-row justify-between items-start">
          <View>
            <Text className="text-green-100 text-lg font-medium">CartFlow</Text>
            <Text className="text-white text-4xl font-bold mt-1">Olá, {nomeUsuario}! 👋</Text>
            <Text className="text-green-50 mt-2 opacity-80">Pronto para economizar hoje?</Text>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SobreScreen')}
            className="bg-green-500 p-3 rounded-full shadow-sm mt-2"
          >
            <Info color="white" size={24} />
          </TouchableOpacity>
        </View>

        <View className="px-6 -mt-10 mb-6">
          <TouchableOpacity 
            onPress={() => navigation.navigate('PlanejamentoScreen', {})}
            activeOpacity={0.8}
            className="bg-white p-8 rounded-[32px] shadow-xl flex-row items-center border border-slate-100"
          >
            <View className="bg-green-100 p-4 rounded-2xl mr-4">
              <PlusCircle size={32} color="#16a34a" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 text-xl font-bold">Planejar Lista</Text>
              <Text className="text-slate-500">Montar lista em casa</Text>
            </View>
            <ArrowRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <View className="flex-row mt-4 gap-4">
            <TouchableOpacity 
              onPress={() => navigation.navigate('HistoricoScreen')}
              className="flex-1 bg-white p-6 rounded-[32px] shadow-lg border border-slate-100 items-center"
            >
              <View className="bg-blue-100 p-3 rounded-xl mb-2">
                <History size={24} color="#2563eb" />
              </View>
              <Text className="text-slate-800 font-bold">Histórico</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('SelecionarPerfilScreen')}
              className="flex-1 bg-white p-6 rounded-[32px] shadow-lg border border-slate-100 items-center opacity-80"
            >
              <View className="bg-purple-100 p-3 rounded-xl mb-2">
                <Users size={24} color="#9333ea" />
              </View>
              <Text className="text-slate-800 font-bold text-center">Trocar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 mb-10">
          <Text className="text-slate-800 font-bold text-xl mb-4">Minhas Listas</Text>
          
          {listasAtivas.length === 0 ? (
            <View className="bg-slate-100 p-6 rounded-[24px] items-center border border-slate-200 border-dashed">
              <Text className="text-slate-500 text-center">
                Você não tem nenhuma lista ativa.{"\n"}Clique em "Planejar Lista" para começar!
              </Text>
            </View>
          ) : (
            listasAtivas.map((lista) => (
              <TouchableOpacity
                key={lista.id}
                onPress={() => navigation.navigate('ListaComprasScreen', { listaId: lista.id })}
                className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex-row items-center mb-3"
              >
                <View className="bg-orange-100 p-3 rounded-xl mr-4">
                  <ShoppingCart size={24} color="#ea580c" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-800 font-bold text-lg">{lista.nome}</Text>
                  <Text className="text-slate-500 text-sm">
                    {lista.itens.length} {lista.itens.length === 1 ? 'item' : 'itens'} • {lista.dataCriacao}
                  </Text>
                </View>
                <ArrowRight size={20} color="#cbd5e1" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}