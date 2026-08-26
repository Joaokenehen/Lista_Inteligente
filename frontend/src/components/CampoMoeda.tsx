import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CampoMoedaProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  valor: string;
  aoMudarTexto: (textoFormatado: string) => void;
}

export function CampoMoeda({ valor, aoMudarTexto, ...resto }: CampoMoedaProps) {
  const aplicarMascaraDeReais = (texto: string) => {
    let apenasNumeros = texto.replace(/\D/g, '');

    if (apenasNumeros === '') {
      aoMudarTexto('');
      return;
    }

    // Converte para número e depois para string com duas casas decimais
    const valorNumerico = (parseInt(apenasNumeros, 10) / 100).toFixed(2);

    // Substitui o ponto decimal por vírgula e aplica os pontos de milhar
    const valorFormatado = valorNumerico
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    aoMudarTexto(valorFormatado);
  };

  return (
    <TextInput
      {...resto}
      value={valor}
      onChangeText={aplicarMascaraDeReais}
      keyboardType="numeric"
    />
  );
}