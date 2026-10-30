import { Request, Response, NextFunction } from 'express';
import { AutenticacaoServico, DadosUsuarioToken } from '../services/auth.service';
import { logger } from '../utils/logger';

export interface RequisicaoAutenticada extends Request {
  usuario?: DadosUsuarioToken;
}

export const verificarAutenticacao = (
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
) => {
  const cabecalhoAutorizacao = req.headers.authorization;

  if (!cabecalhoAutorizacao || !cabecalhoAutorizacao.startsWith('Bearer ')) {
    logger.alerta('Acesso negado: Cabeçalho Authorization ausente ou inválido.');
    return res.status(401).json({ error: 'Acesso negado. Token não informado.' });
  }

  const token = cabecalhoAutorizacao.split(' ')[1];

  try {
    const usuarioDecodificado = AutenticacaoServico.verificarTokenJwt(token);
    req.usuario = usuarioDecodificado;
    return next();
  } catch (error) {
    logger.alerta('Acesso negado: Sessão inválida ou expirada.');
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
};