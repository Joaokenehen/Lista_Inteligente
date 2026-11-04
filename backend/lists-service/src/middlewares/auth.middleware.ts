import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface RequestAutenticado extends Request {
  usuarioId?: number;
}

export const autenticarJwt = (req: RequestAutenticado, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acesso não fornecido ou malformatado.' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

  try {
    const payload = jwt.verify(token, secret) as { id: number; email: string };
    req.usuarioId = payload.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};