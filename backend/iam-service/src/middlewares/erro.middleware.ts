import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const manipuladorGlobalErros = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Exceção não tratada capturada:', err.stack || err.message);

  return res.status(500).json({
    error: 'Ocorreu um erro interno no servidor.',
  });
};