import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface ErroCustomizado extends Error {
  status?: number;
}

export const manipuladorGlobalErros = (
  err: ErroCustomizado,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno do servidor.';

  logger.error(`[${req.method}] ${req.originalUrl} - Status: ${status} - Erro: ${mensagem}`);

  return res.status(status).json({
    status,
    mensagem,
  });
};