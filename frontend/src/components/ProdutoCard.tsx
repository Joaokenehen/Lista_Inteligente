import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Circle, CheckCircle2, Trash2 } from 'lucide-react-native';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  comprado: boolean;
  quantidade?: number;
  porPeso?: boolean;
}

interface ProdutoCardProps {
  item: Produto;
  onPress: () => void;
  onRemove?: () => void;
  onSelect?: () => void;
  selecionado?: boolean;
}

export function ProdutoCard({ item, onPress, onRemove, onSelect, selecionado = false }: ProdutoCardProps) {
  if (item.comprado) {
    return (
      <TouchableOpacity 
        onPress={onPress}
        className="bg-green-50 p-4 rounded-2xl mb-3 flex-row justify-between items-center border border-green-200"
      >
        <View className="flex-row items-center gap-3">
          <CheckCircle2 color="#16a34a" size={24} />
          <Text className="text-slate-500 font-medium text-lg line-through">{item.nome}</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Text className="text-green-700 font-bold text-lg">
            R$ {(item.porPeso ? item.preco * (item.quantidade || 1) : item.preco).toFixed(2)}
          </Text>
          {item.quantidade !== undefined && (
            <Text className="text-slate-500 font-medium text-lg">
              {item.porPeso ? `${item.quantidade} kg` : `x${item.quantidade}`}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View className={`bg-white p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm border ${selecionado ? 'border-blue-400 bg-blue-50' : 'border-slate-100'}`}>
      <TouchableOpacity onPress={onSelect} className="p-1 mr-2" hitSlop={8}>
        {selecionado
          ? <CheckCircle2 color="#2563eb" size={24} />
          : <Circle color="#cbd5e1" size={24} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress} className="flex-1 py-1">
        <Text className="text-slate-800 font-medium text-lg">{item.nome}</Text>
      </TouchableOpacity>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} className="p-2">
          <Trash2 color="#ef4444" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
}
