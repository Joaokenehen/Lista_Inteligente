import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Check, Search, X } from 'lucide-react-native';
import { CATALOGO_PADRAO } from '../data/catalogoPadrao';

interface CatalogoItensModalProps {
  visible: boolean;
  nomesSelecionados: string[];
  onAlternarItem: (nome: string) => void;
  onClose: () => void;
}

const normalizarTexto = (texto: string) =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

const CATEGORIAS = ['Todas', ...Array.from(new Set(CATALOGO_PADRAO.map(item => item.categoria)))];

export function CatalogoItensModal({
  visible,
  nomesSelecionados,
  onAlternarItem,
  onClose,
}: CatalogoItensModalProps) {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const nomesSelecionadosNormalizados = useMemo(
    () => new Set(nomesSelecionados.map(normalizarTexto)),
    [nomesSelecionados]
  );
  const itensFiltrados = CATALOGO_PADRAO.filter(item =>
    (categoria === 'Todas' || item.categoria === categoria) &&
    normalizarTexto(item.nome).includes(normalizarTexto(busca))
  );
  const quantidadeSelecionada = CATALOGO_PADRAO.filter(item =>
    nomesSelecionadosNormalizados.has(normalizarTexto(item.nome))
  ).length;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-slate-50 pt-12">
        <View className="flex-row items-center justify-between px-5 pb-4">
          <View>
            <Text className="text-slate-900 text-2xl font-black">Itens prontos</Text>
            <Text className="text-slate-500 mt-1">Toque para adicionar ou remover</Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-white"
            accessibilityRole="button"
            accessibilityLabel="Fechar catálogo"
          >
            <X color="#475569" size={24} />
          </TouchableOpacity>
        </View>

        <View className="mx-5 mb-3 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
          <Search color="#64748b" size={20} />
          <TextInput
            placeholder="Pesquisar produto"
            className="flex-1 p-4 text-slate-800"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} accessibilityLabel="Limpar busca">
              <X color="#64748b" size={18} />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row flex-wrap px-5 pb-1">
          {CATEGORIAS.map(opcao => {
            const selecionada = categoria === opcao;
            return (
              <TouchableOpacity
                key={opcao}
                onPress={() => setCategoria(opcao)}
                className={`mr-2 mb-2 rounded-full px-4 py-2 ${selecionada ? 'bg-green-700' : 'bg-white border border-slate-200'}`}
              >
                <Text className={`font-semibold ${selecionada ? 'text-white' : 'text-slate-600'}`}>
                  {opcao}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          style={{ flex: 1 }}
          data={itensFiltrados}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={(
            <Text className="text-slate-500 text-center mt-10 px-6">
              Nenhum produto encontrado. Você pode adicioná-lo pelo campo manual.
            </Text>
          )}
          renderItem={({ item }) => {
            const selecionado = nomesSelecionadosNormalizados.has(normalizarTexto(item.nome));
            return (
              <TouchableOpacity
                onPress={() => onAlternarItem(item.nome)}
                className={`mb-3 min-h-20 flex-row items-center rounded-2xl border p-3 ${selecionado ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-white'}`}
                style={{ width: '48%' }}
                accessibilityRole="button"
                accessibilityState={{ selected: selecionado }}
                accessibilityLabel={`${item.nome}${selecionado ? ', selecionado' : ''}`}
              >
                <View className={`mr-2 h-6 w-6 items-center justify-center rounded-full border ${selecionado ? 'border-green-600 bg-green-600' : 'border-slate-300 bg-white'}`}>
                  {selecionado && <Check color="white" size={15} />}
                </View>
                <Text className={`flex-1 font-semibold ${selecionado ? 'text-green-800' : 'text-slate-700'}`}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <View className="border-t border-slate-200 bg-white px-5 pb-8 pt-4">
          <TouchableOpacity onPress={onClose} className="flex-row items-center justify-center rounded-2xl bg-green-600 p-4">
            <Text className="text-white font-bold text-base">
              Concluir ({quantidadeSelecionada} {quantidadeSelecionada === 1 ? 'selecionado' : 'selecionados'})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
