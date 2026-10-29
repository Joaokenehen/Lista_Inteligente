import { Request, Response, NextFunction } from 'express';
import { AutenticacaoServico, DadosUsuarioToken } from '../services/auth.service';

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
    return res.status(401).json({ erro: 'Acesso negado. Token não informado.' });
  }

  const token = cabecalhoAutorizacao.split(' ')[1];

  try {
    const usuarioDecodificado = AutenticacaoServico.verificarTokenJwt(token);
    req.usuario = usuarioDecodificado; // Injeta o usuário logado na requisição
    return next();
  } catch (error) {
    return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  }
};