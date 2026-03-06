import "./global.css";
import { View, Text, TouchableOpacity } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-100 p-6">
      <View className="bg-white p-8 rounded-2xl shadow-lg w-full items-center">
        <Text className="text-2xl font-bold text-green-600 mb-2">
          🛒 Mercado App
        </Text>
        <Text className="text-slate-500 text-center mb-6">
          Ambiente configurado com sucesso!
        </Text>
        
        <TouchableOpacity 
          className="bg-green-500 px-6 py-3 rounded-full active:bg-green-700"
          onPress={() => console.log("Clicou!")}
        >
          <Text className="text-white font-semibold">Adicionar Primeiro Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}