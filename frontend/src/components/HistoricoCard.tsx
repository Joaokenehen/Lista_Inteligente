import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, CheckCircle2, Circle } from 'lucide-react-native';

export interface CompraHistorico {
  id: string;
  data: string;
  valorTotal: number;
  total?: number;
  itens: any[];
}

interface HistoricoCardProps {
  item: CompraHistorico;
  modoExclusao: boolean;
  isSelecionado: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

export function HistoricoCard({ 
  item, 
  modoExclusao, 
  isSelecionado, 
  onPress, 
  onLongPress 
}: HistoricoCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={modoExclusao ? 0.7 : 1}
      onPress={onPress}
      onLongPress={onLongPress}
      className={`bg-white p-5 rounded-3xl mb-4 shadow-sm border flex-row justify-between items-center ${isSelecionado ? 'border-red-400 bg-red-50' : 'border-slate-100'}`}
    >
      <View className="flex-row items-center gap-4 flex-1">
        {modoExclusao && (
          <View className="mr-2">
            {isSelecionado ? <CheckCircle2 color="#ef4444" size={24} /> : <Circle color="#cbd5e1" size={24} />}
          </View>
        )}
        
        <View className={`${modoExclusao ? 'bg-red-100' : 'bg-blue-50'} p-4 rounded-2xl`}>
          <Calendar color={modoExclusao ? "#ef4444" : "#2563eb"} size={24} />
        </View>
        <View>
          <Text className="text-slate-800 font-bold text-lg">{item.data}</Text>
          <Text className="text-slate-500 text-sm">{item.itens.length} itens comprados</Text>
        </View>
      </View>
        <Text className="text-slate-900 font-black text-xl">R$ {(item.valorTotal ?? item.total ?? 0).toFixed(2)}</Text>
    </TouchableOpacity>
  );
}