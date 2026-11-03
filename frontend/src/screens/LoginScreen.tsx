import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, type ScrollViewInstance, type TextInputInstance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Registrar: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export function LoginScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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

  const handleLogin = () => {
    // Aqui faremos a integração com a API do Fedora posteriormente
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
        <View className="mb-10 items-start">
          <Text className="text-left text-4xl font-extrabold text-green-900">
            Bem-vindo(a)!
          </Text>
          <Text className="mt-2 text-left text-base text-green-800">
            Faça login para aceder às suas listas no CARTFLOW.
          </Text>
        </View>

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
            <TextInput
              ref={senhaInputRef}
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-green-950"
              placeholder="Senha"
              placeholderTextColor="#86a98d"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              onFocus={() => focarCampo('senha')}
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                handleLogin();
              }}
            />
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity 
            className="mt-6 w-full items-center rounded-xl bg-green-700 py-4 shadow-sm"
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text className="text-lg font-bold text-white">Entrar</Text>
          </TouchableOpacity>
        </View>

        {/* Link para a tela de Registo */}
        <View className="mt-8 flex-row">
          <Text className="text-green-900">Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
            <Text className="font-bold text-green-700">Criar agora</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}