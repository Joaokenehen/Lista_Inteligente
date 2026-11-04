import { Platform } from 'react-native';

type AmbienteApi = 'local' | 'servidor';

// Troque para 'servidor' quando quiser usar o endereço configurado no Swagger.
const AMBIENTE_API: AmbienteApi = 'local';
const URL_SERVIDOR = 'http://10.0.2.95:3000';

const URL_LOCAL = Platform.OS === 'android'
  ? 'http://10.0.2.2:3000'
  : 'http://localhost:3000';

const URLS_API: Record<AmbienteApi, string> = {
  local: URL_LOCAL,
  servidor: URL_SERVIDOR,
};

export const API_BASE_URL = URLS_API[AMBIENTE_API];
export const MENSAGEM_ERRO_CONEXAO = 'Não foi possível conectar ao servidor. Verifique se a API está em execução e tente novamente.';
