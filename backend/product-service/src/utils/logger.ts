const obterDataHora = (): string => {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
};

export const logger = {
  info: (mensagem: string) => {
    console.log(`\x1b[36m[INFO]\x1b[0m [${obterDataHora()}] ${mensagem}`);
  },

  sucesso: (mensagem: string) => {
    console.log(`\x1b[32m[SUCESSO]\x1b[0m [${obterDataHora()}] ${mensagem}`);
  },

  alerta: (mensagem: string) => {
    console.warn(`\x1b[33m[ALERTA]\x1b[0m [${obterDataHora()}] ${mensagem}`);
  },

  error: (mensagem: string, detalhe: any = '') => {
    console.error(`\x1b[31m[ERRO]\x1b[0m [${obterDataHora()}] ${mensagem}`, detalhe);
  },
};