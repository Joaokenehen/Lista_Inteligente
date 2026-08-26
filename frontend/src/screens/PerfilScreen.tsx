import { useState } from "react"
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { InputCard } from "../components/InputCard"
import { UserPlus } from "lucide-react-native"
import { AppNavigationProp } from "../types/navigation"

export function PerfilScreen() {
    const [nome, setNome] = useState("")
    const navigation = useNavigation<AppNavigationProp>()

    const handleSalvar = async () => {
        if (!nome.trim()) {
            Alert.alert("Erro", "Por favor, insira um nome válido.")
            return
        }

        if (nome.trim().length > 20) {
            Alert.alert("Aviso", "O nome do perfil não pode ter mais de 20 caracteres.");
            return;
        }

        try {
            const perfisSalvos = await AsyncStorage.getItem('@Lista-inteligente:perfis');
            let listaPerfis = perfisSalvos ? JSON.parse(perfisSalvos) : [];

            if (!listaPerfis.includes(nome.trim())) {
                listaPerfis.push(nome.trim());
                await AsyncStorage.setItem('@Lista-inteligente:perfis', JSON.stringify(listaPerfis));
            }

            await AsyncStorage.setItem('@Lista-inteligente:perfilAtual', nome.trim());
            
            Alert.alert("Sucesso", "Nome salvo com sucesso!");
            navigation.navigate("HomeScreen");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar o nome.")
        }
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                className="bg-slate-50 px-8"
            >
                <View className="items-center mb-10 mt-10">
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
                    maxLength={20}
                />

                <TouchableOpacity 
                    onPress={handleSalvar}
                    activeOpacity={0.8}
                    className="bg-green-600 p-5 rounded-2xl items-center shadow-lg mt-4 mb-10"
                >
                    <Text className="text-white font-bold text-lg">Começar agora</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}