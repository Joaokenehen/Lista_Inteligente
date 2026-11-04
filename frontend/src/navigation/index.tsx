import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { getAuthToken } from '../services/authStorage';

export function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  const carregarSessao = useCallback(async () => {
    setCarregandoSessao(true);

    try {
      setIsAuthenticated(Boolean(await getAuthToken()));
    } catch (error) {
      console.error('Não foi possível restaurar a sessão salva:', error);
      setIsAuthenticated(false);
    } finally {
      setCarregandoSessao(false);
    }
  }, []);

  useEffect(() => {
    void carregarSessao();
  }, [carregarSessao]);

  if (carregandoSessao) {
    return (
      <View className="flex-1 items-center justify-center bg-green-50">
        <ActivityIndicator color="#15803d" />
      </View>
    );
  }

  return isAuthenticated ? (
    <AppNavigator autenticado onSair={() => setIsAuthenticated(false)} />
  ) : (
    <AuthNavigator onAuthenticated={() => setIsAuthenticated(true)} />
  );
}