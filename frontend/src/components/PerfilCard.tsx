import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { User, Pencil } from 'lucide-react-native';

interface PerfilCardProps {
  nome: string;
  onPress: () => void;
  onEdit: () => void; 
}

export function PerfilCard({ nome, onPress, onEdit }: PerfilCardProps) {
  return (
    // A View principal segura tudo e define o tamanho
    <View className="relative w-[47%] mb-6">
      
      {/* Botão Principal (Abre o Perfil) */}
      <TouchableOpacity 
        onPress={onPress}
        className="bg-white p-6 rounded-[32px] items-center shadow-sm border border-slate-100 w-full"
      >
        <View className="bg-green-100 p-4 rounded-full mb-3 mt-4">
          <User size={32} color="#16a34a" />
        </View>
        <Text className="text-slate-800 font-bold text-lg" numberOfLines={1}>
          {nome}
        </Text>
      </TouchableOpacity>

      {/* Botão de Editar flutuante (Separado do botão principal para não bugar) */}
      <TouchableOpacity 
        onPress={onEdit} 
        className="absolute top-2 right-2 p-3 bg-slate-100 rounded-full z-20 shadow-sm border border-slate-200"
      >
        <Pencil size={18} color="#64748b" />
      </TouchableOpacity>
      
    </View>
  );
}