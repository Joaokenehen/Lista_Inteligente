import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

// Limitador geral de requisições
export const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.alerta(`Rate limit atingido para o IP: ${req.ip}`);
    res.status(429).json({ error: 'Muitas requisições efetuadas. Tente novamente mais tarde.' });
  },
});

// Limitador estrito para Login e Cadastro (proteção contra força bruta)
export const limitadorAutenticacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.alerta(`Rate limit de autenticação atingido para o IP: ${req.ip}`);
    res.status(429).json({ error: 'Muitas tentativas de autenticação. Tente novamente após 15 minutos.' });
  },
});