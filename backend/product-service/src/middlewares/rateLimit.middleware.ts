import rateLimit from 'express-rate-limit';

export const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por janela por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    mensagem: 'Muitas requisições originadas deste IP, tente novamente após 15 minutos.',
  },
});