const cores = {
  reset: '\x1b[0m',
  info: '\x1b[36m',    // Ciano
  sucesso: '\x1b[32m', // Verde
  alerta: '\x1b[33m',  // Amarelo
  erro: '\x1b[31m',    // Vermelho
};

const formatarHora = () => new Date().toLocaleTimeString('pt-BR');

export const logger = {
  info: (mensagem: string, ...detalhes: any[]) => {
    console.log(`${cores.info}[INFO] [${formatarHora()}] ${mensagem}${cores.reset}`, ...detalhes);
  },

  sucesso: (mensagem: string, ...detalhes: any[]) => {
    console.log(`${cores.sucesso}[SUCESSO] [${formatarHora()}] ${mensagem}${cores.reset}`, ...detalhes);
  },

  alerta: (mensagem: string, ...detalhes: any[]) => {
    console.warn(`${cores.alerta}[ALERTA] [${formatarHora()}] ${mensagem}${cores.reset}`, ...detalhes);
  },

  error: (mensagem: string, ...detalhes: any[]) => {
    console.error(`${cores.erro}[ERRO] [${formatarHora()}] ${mensagem}${cores.reset}`, ...detalhes);
  },
};