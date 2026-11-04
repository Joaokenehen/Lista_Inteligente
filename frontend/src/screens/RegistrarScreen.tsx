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
import { API_BASE_URL, MENSAGEM_ERRO_CONEXAO } from '../services/apiConfig';

type AuthStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Registrar: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

const LIMITE_NOME = 100;
const LIMITE_EMAIL = 254;
const LIMITE_SENHA = 128;

export function RegistrarScreen() {
  const navigation = useNavigation<NavigationProps>();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [alturaTeclado, setAlturaTeclado] = useState(0);
  const scrollViewRef = useRef<ScrollViewInstance | null>(null);
  const campoFocadoRef = useRef<string | null>(null);
  const emailInputRef = useRef<TextInputInstance | null>(null);
  const senhaInputRef = useRef<TextInputInstance | null>(null);
  const confirmarSenhaInputRef = useRef<TextInputInstance | null>(null);

  const requisitosSenha = [
    { texto: 'Pelo menos 8 caracteres', atende: senha.length >= 8 },
    { texto: 'Pelo menos uma letra maiúscula', atende: /[A-Z]/.test(senha) },
    { texto: 'Pelo menos um caractere especial', atende: /[^A-Za-z0-9\s]/.test(senha) },
  ];

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
    if (alturaTeclado === 0 || !campoFocadoRef.current) return;

    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [alturaTeclado]);

  const focarCampo = (campo: string) => {
    campoFocadoRef.current = campo;

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleRegistrar = async () => {
    setMensagemErro(null);

    // 1. Validações locais (client-side)
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setMensagemErro('Preencha todos os campos para continuar.');
      return;
    }

    if (nome.trim().length > LIMITE_NOME) {
      setMensagemErro(`O nome deve ter no máximo ${LIMITE_NOME} caracteres.`);
      return;
    }

    if (email.trim().length > LIMITE_EMAIL || !/^[^\s@]+@[^\s@]+\.com$/i.test(email.trim())) {
      setMensagemErro('Informe um e-mail válido terminado em .com.');
      return;
    }

    if (requisitosSenha.some((requisito) => !requisito.atende)) {
      setMensagemErro('A senha ainda não atende a todos os requisitos.');
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagemErro('As senhas não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      let response: Response;
      try {
        response = await fetch(`${API_BASE_URL}/auth/cadastrar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha,
          }),
        });
      } catch (error) {
        console.error('Falha ao conectar à API de cadastro:', error);
        throw new Error(MENSAGEM_ERRO_CONEXAO);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro ao realizar o cadastro.');
      }

      navigation.navigate('Login');
    } catch (error) {
      setMensagemErro(
        error instanceof Error ? error.message : 'Erro ao realizar cadastro.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-green-50"
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: alturaTeclado + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8 items-start">
          <Text className="text-left text-4xl font-extrabold text-green-900">
            Nova Conta
          </Text>
          <Text className="mt-2 text-left text-base text-green-800">
            Preencha os dados para criar o seu perfil.
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
          <View className="mb-4">
            <Text className="mb-2 text-left font-semibold text-green-900">Nome</Text>
            <TextInput
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-green-950"
              placeholder="Nome completo"
              placeholderTextColor="#86a98d"
              value={nome}
              maxLength={LIMITE_NOME}
              onChangeText={setNome}
              onFocus={() => focarCampo('nome')}
              returnKeyType="next"
              submitBehavior="submit"
              onSubmitEditing={() => emailInputRef.current?.focus()}
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-left font-semibold text-green-900">E-mail</Text>
            <TextInput
              ref={emailInputRef}
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

          <View className="mb-4">
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
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => confirmarSenhaInputRef.current?.focus()}
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
            <View className="mt-2">
              {requisitosSenha.map((requisito) => (
                <Text
                  key={requisito.texto}
                  className={`text-sm ${requisito.atende ? 'text-green-700' : 'text-red-600'}`}
                >
                  {requisito.atende ? '✓' : '•'} {requisito.texto}
                </Text>
              ))}
            </View>
          </View>

          <View className="mb-2">
            <Text className="mb-2 text-left font-semibold text-green-900">Confirmar Senha</Text>
            <View className="w-full flex-row items-center rounded-xl border border-green-200 bg-white pr-3">
              <TextInput
                ref={confirmarSenhaInputRef}
                className="flex-1 px-4 py-3 text-left text-green-950"
                placeholder="Confirme a senha"
                placeholderTextColor="#86a98d"
                secureTextEntry={!mostrarConfirmarSenha}
                value={confirmarSenha}
                maxLength={LIMITE_SENHA}
                onChangeText={setConfirmarSenha}
                onFocus={() => focarCampo('confirmarSenha')}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
                onSubmitEditing={() => {
                  Keyboard.dismiss();
                  handleRegistrar();
                }}
              />
              <TouchableOpacity
                onPress={() => setMostrarConfirmarSenha((visivel) => !visivel)}
                accessibilityRole="button"
                accessibilityLabel={mostrarConfirmarSenha ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
                hitSlop={10}
              >
                {mostrarConfirmarSenha
                  ? <EyeOff size={20} color="#166534" />
                  : <Eye size={20} color="#166534" />}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            className={`mt-6 w-full flex-row items-center justify-center rounded-xl py-4 shadow-sm ${
              carregando ? 'bg-green-600' : 'bg-green-700'
            }`}
            onPress={handleRegistrar}
            disabled={carregando}
            activeOpacity={0.85}
          >
            {carregando ? (
              <ActivityIndicator color="#ffffff" className="mr-2" />
            ) : null}
            <Text className="text-lg font-bold text-white">
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link para voltar ao Login */}
        <View className="mt-8 mb-6 flex-row justify-center">
          <Text className="text-green-900">Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="font-bold text-green-700">Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}