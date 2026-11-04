import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  type ScrollViewInstance,
  type TextInputInstance,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { saveAuthToken } from '../services/authStorage';
import { API_BASE_URL, MENSAGEM_ERRO_CONEXAO } from '../services/apiConfig';

type AuthStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Registrar: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;
type LoginScreenProps = {
  onAuthenticated: () => void;
};

const LIMITE_EMAIL = 254;
const LIMITE_SENHA = 128;

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const navigation = useNavigation<NavigationProps>();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados de feedback visual
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const [alturaTeclado, setAlturaTeclado] = useState(0);
  const scrollViewRef = useRef<ScrollViewInstance | null>(null);
  const campoFocadoRef = useRef<string | null>(null);
  const senhaInputRef = useRef<TextInputInstance | null>(null);

  useEffect(() => {
    const mostrarSubscription = Keyboard.addListener('keyboardDidShow', ({ endCoordinates }) => {
      setAlturaTeclado(endCoordinates.height);
    });
    const ocultarSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setAlturaTeclado(0);
    });

    return () => {
      mostrarSubscription.remove();
      ocultarSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (alturaTeclado === 0 || campoFocadoRef.current !== 'senha') return;

    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [alturaTeclado]);

  const focarCampo = (campo: string) => {
    campoFocadoRef.current = campo;

    if (campo === 'senha') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  const handleLogin = async () => {
    setMensagemErro(null);

    // Validação básica client-side
    if (!email.trim() || !senha) {
      setMensagemErro('Informe o e-mail e a senha para acessar.');
      return;
    }

    setCarregando(true);

    try {
      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            senha,
          }),
        });
      } catch (error) {
        console.error('Falha ao conectar à API de autenticação:', error);
        throw new Error(MENSAGEM_ERRO_CONEXAO);
      }

      const data: unknown = await response.json();

      const resposta = typeof data === 'object' && data !== null
        ? data as { error?: unknown; token?: unknown }
        : {};
      if (!response.ok) {
        throw new Error(
          typeof resposta.error === 'string' ? resposta.error : 'Erro ao realizar login.'
        );
      }

      if (typeof resposta.token !== 'string' || !resposta.token) {
        throw new Error('O servidor não retornou um token de acesso válido.');
      }

      await saveAuthToken(resposta.token);
      onAuthenticated();
    } catch (error) {
      setMensagemErro(
        error instanceof Error ? error.message : 'Erro ao realizar login.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-green-50 px-6"
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingTop: 24,
          paddingBottom: alturaTeclado + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8 items-start">
          <Text className="text-left text-4xl font-extrabold text-green-900">
            Bem-vindo(a)!
          </Text>
          <Text className="mt-2 text-left text-base text-green-800">
            Entre para sincronizar seus dados e acessar recursos exclusivos.
          </Text>
        </View>

        {/* Banner de Erro Responsivo */}
        {mensagemErro && (
          <View className="mb-4 rounded-xl border border-red-300 bg-red-100 p-3">
            <Text className="text-center font-medium text-red-700">
              {mensagemErro}
            </Text>
          </View>
        )}

        <View>
          {/* Input E-mail */}
          <View className="mb-4">
            <Text className="mb-2 text-left font-semibold text-green-900">E-mail</Text>
            <TextInput
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-green-950"
              placeholder="E-mail"
              placeholderTextColor="#86a98d"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              maxLength={LIMITE_EMAIL}
              onChangeText={setEmail}
              onFocus={() => focarCampo('email')}
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => senhaInputRef.current?.focus()}
            />
          </View>

          {/* Input Senha */}
          <View className="mb-2">
            <Text className="mb-2 text-left font-semibold text-green-900">Senha</Text>
            <View className="w-full flex-row items-center rounded-xl border border-green-200 bg-white pr-3">
              <TextInput
                ref={senhaInputRef}
                className="flex-1 px-4 py-3 text-left text-green-950"
                placeholder="Senha"
                placeholderTextColor="#86a98d"
                secureTextEntry={!mostrarSenha}
                value={senha}
                maxLength={LIMITE_SENHA}
                onChangeText={setSenha}
                onFocus={() => focarCampo('senha')}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  handleLogin();
                }}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha((visivel) => !visivel)}
                accessibilityRole="button"
                accessibilityLabel={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                hitSlop={10}
              >
                {mostrarSenha
                  ? <EyeOff size={20} color="#166534" />
                  : <Eye size={20} color="#166534" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity 
            className={`mt-6 w-full flex-row items-center justify-center rounded-xl py-4 shadow-sm ${
              carregando ? 'bg-green-600' : 'bg-green-700'
            }`}
            onPress={handleLogin}
            disabled={carregando}
            activeOpacity={0.85}
          >
            {carregando ? (
              <ActivityIndicator color="#ffffff" className="mr-2" />
            ) : null}
            <Text className="text-lg font-bold text-white">
              {carregando ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link para a tela de Registro */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-green-900">Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
            <Text className="font-bold text-green-700">Criar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}