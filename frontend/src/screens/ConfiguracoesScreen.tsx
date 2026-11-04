import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, LogOut } from 'lucide-react-native';
import { AppNavigationProp } from '../types/navigation';
import { getAuthToken, removeAuthToken } from '../services/authStorage';
import { API_BASE_URL } from '../services/apiConfig';

type ConfiguracoesScreenProps = {
  autenticado: boolean;
  onSair: () => void;
};

export function ConfiguracoesScreen({
  autenticado,
  onSair,
}: ConfiguracoesScreenProps) {
  const navigation = useNavigation<AppNavigationProp>();
  const [saindo, setSaindo] = useState(false);

  const sair = async () => {
    if (saindo) return;

    setSaindo(true);
    try {
      if (autenticado) {
        const token = await getAuthToken();
        if (token) {
          try {
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              console.warn(`O backend não registrou o logout (HTTP ${response.status}).`);
            }
          } catch (error) {
            console.warn('Não foi possível registrar o logout no backend:', error);
          }
        }

        await removeAuthToken();
      }
      onSair();
    } catch (error) {
      console.error('Não foi possível encerrar a sessão:', error);
      Alert.alert('Erro', 'Não foi possível encerrar a sessão. Tente novamente.');
    } finally {
      setSaindo(false);
    }
  };

  const confirmarSaida = () => {
    Alert.alert(
      'Confirmar saída',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => void sair() },
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-row items-center bg-green-600 px-6 pb-6 pt-16 shadow-md">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="-ml-2 mr-2 p-2"
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ChevronLeft color="white" size={28} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Configurações</Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <TouchableOpacity
          onPress={confirmarSaida}
          disabled={saindo}
          className="flex-row items-center rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
          accessibilityRole="button"
          accessibilityLabel="Sair"
        >
          <LogOut color="#dc2626" size={22} />
          <Text className="ml-3 text-base font-bold text-red-600">
            {saindo ? 'Saindo...' : 'Sair'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
