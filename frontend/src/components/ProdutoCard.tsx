import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Circle, CheckCircle2, Trash2 } from 'lucide-react-native';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  comprado: boolean;
}

interface ProdutoCardProps {
  item: Produto;
  onPress: () => void;
  onRemove?: () => void;
}

export function ProdutoCard({ item, onPress, onRemove }: ProdutoCardProps) {
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
          <Text className="text-green-700 font-bold text-lg">R$ {item.preco.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm border border-slate-100"
    >
      <View className="flex-row items-center gap-3">
        <Circle color="#cbd5e1" size={24} />
        <Text className="text-slate-800 font-medium text-lg">{item.nome}</Text>
      </View>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} className="p-2">
          <Trash2 color="#ef4444" size={20} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}