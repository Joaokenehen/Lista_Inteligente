import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { getAuthToken, removeAuthToken } from '../services/authStorage';
import { API_BASE_URL } from '../services/apiConfig';

export function AppRoutes() {
  const [estadoSessao, setEstadoSessao] = useState<
    'carregando' | 'autenticado' | 'visitante' | 'indisponivel'
  >('carregando');
  const [sessaoExpirada, setSessaoExpirada] = useState(false);

  const carregarSessao = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        setEstadoSessao('visitante');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/validar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let tokenValido = false;
      if (response.ok) {
        const data: unknown = await response.json();
        tokenValido =
          typeof data === 'object' &&
          data !== null &&
          'valido' in data &&
          data.valido === true;
      } else if (response.status !== 401) {
        throw new Error(`O servidor respondeu com HTTP ${response.status}.`);
      }

      if (tokenValido) {
        setEstadoSessao('autenticado');
        return;
      }

      await removeAuthToken();
      setSessaoExpirada(true);
      setEstadoSessao('visitante');
    } catch (error) {
      console.error('Não foi possível validar a sessão no servidor:', error);
      setEstadoSessao('indisponivel');
    }
  }, []);

  useEffect(() => {
    void carregarSessao();
  }, [carregarSessao]);

  if (estadoSessao === 'carregando') {
    return (
      <View className="flex-1 items-center justify-center bg-green-50">
        <ActivityIndicator color="#15803d" />
      </View>
    );
  }

  if (estadoSessao === 'indisponivel') {
    return (
      <View className="flex-1 items-center justify-center bg-green-50 px-6">
        <Text className="mb-6 text-center text-green-900">
          Não foi possível verificar sua sessão. Confira sua conexão com o servidor.
        </Text>
        <TouchableOpacity
          className="mb-4 rounded-xl bg-green-700 px-6 py-3"
          onPress={() => {
            setEstadoSessao('carregando');
            void carregarSessao();
          }}
        >
          <Text className="font-bold text-white">Tentar novamente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSessaoExpirada(false);
            setEstadoSessao('visitante');
          }}
        >
          <Text className="font-semibold text-green-800">Continuar sem login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return estadoSessao === 'autenticado' ? (
    <AppNavigator
      autenticado
      onSair={() => {
        setSessaoExpirada(false);
        setEstadoSessao('visitante');
      }}
    />
  ) : (
    <AuthNavigator
      sessaoExpirada={sessaoExpirada}
      onAuthenticated={() => {
        setSessaoExpirada(false);
        setEstadoSessao('autenticado');
      }}
    />
  );
}