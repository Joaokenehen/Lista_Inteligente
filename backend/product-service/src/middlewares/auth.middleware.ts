import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequisicaoAutenticada extends Request {
  usuarioId?: number;
}

export const autenticarJWT = (
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const segredo = process.env.JWT_SECRET || 'segredo_padrao_dev';
    const decodificado = jwt.verify(token, segredo) as { id: number };

    req.usuarioId = decodificado.id;
    return next();
  } catch (error) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
};