import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, type ScrollViewInstance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AuthStackParamList = {
  Dashboard: undefined;
  Login: undefined;
  Registrar: undefined;
};

type NavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export function RegistrarScreen() {
  const navigation = useNavigation<NavigationProps>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alturaTeclado, setAlturaTeclado] = useState(0);
  const scrollViewRef = useRef<ScrollViewInstance | null>(null);
  const campoFocadoRef = useRef<string | null>(null);

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
    if (alturaTeclado === 0 || campoFocadoRef.current !== 'confirmarSenha') return;

    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timeout);
  }, [alturaTeclado]);

  const focarCampo = (campo: string) => {
    campoFocadoRef.current = campo;

    if (campo === 'confirmarSenha') {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  };

  const handleRegistrar = () => {
    // Validação simples antes de enviar para o backend
    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
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
        <View className="mb-10 items-start">
          <Text className="text-left text-4xl font-extrabold text-green-900">
            Nova Conta
          </Text>
          <Text className="mt-2 text-left text-base text-green-800">
            Preencha os dados para criar o seu perfil.
          </Text>
        </View>

        <View>
          <View className="mb-4">
            <Text className="mb-2 text-left font-semibold text-green-900">Nome</Text>
            <TextInput
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-green-950"
              placeholder="Nome completo"
              placeholderTextColor="#86a98d"
              value={nome}
              onChangeText={setNome}
              onFocus={() => focarCampo('nome')}
            />
          </View>

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
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-left font-semibold text-green-900">Senha</Text>
            <TextInput
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-green-950"
              placeholder="Senha"
              placeholderTextColor="#86a98d"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              onFocus={() => focarCampo('senha')}
            />
          </View>

          <View className="mb-2">
            <Text className="mb-2 text-left font-semibold text-green-900">Confirmar Senha</Text>
            <TextInput
              className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 text-left text-green-950"
              placeholder="Confirme a senha"
              placeholderTextColor="#86a98d"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              onFocus={() => focarCampo('confirmarSenha')}
            />
          </View>

          <TouchableOpacity 
            className="mt-6 w-full items-center rounded-xl bg-green-700 py-4 shadow-sm"
            onPress={handleRegistrar}
            activeOpacity={0.85}
          >
            <Text className="text-lg font-bold text-white">Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Link para voltar ao Login */}
        <View className="mt-8 mb-6 flex-row">
          <Text className="text-green-900">Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="font-bold text-green-700">Fazer login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}