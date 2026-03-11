import { useState } from "react"
import { View, Text, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { InputCard } from "../components/InputCard"
import { UserPlus } from "lucide-react-native"
import { AppNavigationProp } from "../types/navigation"

export function PerfilScreen() {
    const [nome, setNome ] = useState("")
    const navigation = useNavigation<AppNavigationProp>()

    const handleSalvar = async () => {
        if (!nome.trim()) {
            Alert.alert("Erro", "Por favor, insira um nome válido.")
            return
        }

        try {
            await AsyncStorage.setItem("@Lista-inteligente:userName", nome);
            navigation.navigate("HomeScreen")
            Alert.alert("Sucesso", "Nome salvo com sucesso!")
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar o nome.")
        }
    }

    return (
    <View className="flex-1 bg-slate-50 justify-center px-8">
      <View className="items-center mb-10">
        <View className="bg-green-100 p-6 rounded-full mb-4">
          <UserPlus size={48} color="#16a34a" />
        </View>
        <Text className="text-slate-900 text-3xl font-bold">Quem está usando?</Text>
        <Text className="text-slate-500 text-center mt-2">
          Crie seu perfil para personalizar sua experiência.
        </Text>
      </View>

      <InputCard 
        label="Nome do Perfil"
        placeholder="Ex: João"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity 
        onPress={handleSalvar}
        activeOpacity={0.8}
        className="bg-green-600 p-5 rounded-2xl items-center shadow-lg mt-4"
      >
        <Text className="text-white font-bold text-lg">Começar agora</Text>
      </TouchableOpacity>
    </View>
  );
}