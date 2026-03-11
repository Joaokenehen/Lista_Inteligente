import { Text, TouchableOpacity, View } from 'react-native';
import { User } from 'lucide-react-native';

interface PerfilCardProps {
  nome: string;
  onPress: () => void;
}

export function PerfilCard({ nome, onPress }: PerfilCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-white p-6 rounded-3xl items-center shadow-md border border-slate-100 mb-4 w-[45%]"
    >
      <View className="bg-green-100 p-4 rounded-full mb-3">
        <User size={32} color="#16a34a" />
      </View>
      <Text className="text-slate-800 font-bold text-lg text-center" numberOfLines={1}>
        {nome}
      </Text>
    </TouchableOpacity>
  );
}