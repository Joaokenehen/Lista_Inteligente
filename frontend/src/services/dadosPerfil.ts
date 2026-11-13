import AsyncStorage from '@react-native-async-storage/async-storage';

export type TipoDadoPerfil = 'listasAtivas' | 'historico';

const CHAVES_LEGADAS: Record<TipoDadoPerfil, string> = {
  listasAtivas: '@Lista-inteligente:listasAtivas',
  historico: '@Lista-inteligente:historico',
};

const CHAVE_MIGRACAO = '@Lista-inteligente:migracaoDadosPorPerfil:v1';
let migracaoEmAndamento: Promise<void> | null = null;

function chaveDoPerfil(tipo: TipoDadoPerfil, perfil: string): string {
  const perfilCodificado = encodeURIComponent(perfil.trim().normalize('NFC'));
  return `@Lista-inteligente:perfil:${perfilCodificado}:${tipo}`;
}

async function migrarDadosLegados(perfil: string): Promise<void> {
  if (await AsyncStorage.getItem(CHAVE_MIGRACAO)) return;

  for (const tipo of ['listasAtivas', 'historico'] as const) {
    const chaveLegada = CHAVES_LEGADAS[tipo];
    const dadoLegado = await AsyncStorage.getItem(chaveLegada);
    const chavePerfil = chaveDoPerfil(tipo, perfil);

    if (dadoLegado !== null && await AsyncStorage.getItem(chavePerfil) === null) {
      await AsyncStorage.setItem(chavePerfil, dadoLegado);
    }
    await AsyncStorage.removeItem(chaveLegada);
  }

  await AsyncStorage.setItem(CHAVE_MIGRACAO, 'concluida');
}

async function garantirMigracao(perfil: string): Promise<void> {
  if (!migracaoEmAndamento) {
    migracaoEmAndamento = migrarDadosLegados(perfil).finally(() => {
      migracaoEmAndamento = null;
    });
  }
  await migracaoEmAndamento;
}

async function obterPerfilAtual(): Promise<string> {
  const perfil = await AsyncStorage.getItem('@Lista-inteligente:perfilAtual');
  if (!perfil?.trim()) {
    throw new Error('Selecione um perfil antes de acessar listas e histórico.');
  }
  return perfil;
}

export async function obterDadoDoPerfil(tipo: TipoDadoPerfil): Promise<string | null> {
  const perfil = await obterPerfilAtual();
  await garantirMigracao(perfil);
  return AsyncStorage.getItem(chaveDoPerfil(tipo, perfil));
}

export async function salvarDadoDoPerfil(tipo: TipoDadoPerfil, valor: string): Promise<void> {
  const perfil = await obterPerfilAtual();
  await garantirMigracao(perfil);
  await AsyncStorage.setItem(chaveDoPerfil(tipo, perfil), valor);
}

export async function renomearDadosDoPerfil(nomeAntigo: string, nomeNovo: string): Promise<void> {
  for (const tipo of ['listasAtivas', 'historico'] as const) {
    const chaveAntiga = chaveDoPerfil(tipo, nomeAntigo);
    const chaveNova = chaveDoPerfil(tipo, nomeNovo);
    const dados = await AsyncStorage.getItem(chaveAntiga);
    if (dados !== null) {
      await AsyncStorage.setItem(chaveNova, dados);
      await AsyncStorage.removeItem(chaveAntiga);
    }
  }
}

export async function removerDadosDoPerfil(nomePerfil: string): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(chaveDoPerfil('listasAtivas', nomePerfil)),
    AsyncStorage.removeItem(chaveDoPerfil('historico', nomePerfil)),
  ]);
}
