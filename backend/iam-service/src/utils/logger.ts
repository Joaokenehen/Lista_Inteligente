const reset = '\x1b[0m';
const vermelho = '\x1b[31m';
const verde = '\x1b[32m';
const amarelo = '\x1b[33m';
const ciano = '\x1b[36m';
const cinza = '\x1b[90m';

export const logger = {
  info: (mensagem: string) => {
    console.log(`${ciano}[INFO]${reset} ${cinza}${new Date().toLocaleTimeString()}${reset} - ${mensagem}`);
  },
  sucesso: (mensagem: string) => {
    console.log(`${verde}[SUCESSO]${reset} ${cinza}${new Date().toLocaleTimeString()}${reset} - ${mensagem}`);
  },
  alerta: (mensagem: string) => {
    console.warn(`${amarelo}[ALERTA]${reset} ${cinza}${new Date().toLocaleTimeString()}${reset} - ${mensagem}`);
  },
  error: (mensagem: string, detalhe?: any) => {
    console.error(`${vermelho}[ERRO]${reset} ${cinza}${new Date().toLocaleTimeString()}${reset} - ${mensagem}`, detalhe ? detalhe : '');
  },
};