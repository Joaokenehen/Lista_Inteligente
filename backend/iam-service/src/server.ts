import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { configurarSwagger } from './config/swagger';
import rotasAutenticacao from './routes/auth.routes';
import { sequelize } from './config/banco';
import { logger } from './utils/logger';
import { limitadorGeral } from './middlewares/rateLimit.middleware';
import { manipuladorGlobalErros } from './middlewares/erro.middleware';

dotenv.config();

const app = express();
const porta = process.env.AUTH_SERVICE_PORT || 3001;
const portaGateway = process.env.GATEWAY_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(limitadorGeral);

// Middleware global para registrar todas as requisições HTTP no terminal do Docker
app.use((req, res, next) => {
  res.on('finish', () => {
    const mensagem = `${req.method} ${req.originalUrl} - Status ${res.statusCode}`;
    if (res.statusCode >= 500) {
      logger.error(mensagem);
    } else if (res.statusCode >= 400) {
      logger.alerta(mensagem);
    } else {
      logger.info(mensagem);
    }
  });
  next();
});

configurarSwagger(app);

app.use('/auth', rotasAutenticacao);
app.use(manipuladorGlobalErros);

sequelize.sync()
  .then(() => {
    logger.sucesso('PostgreSQL sincronizado com sucesso via Sequelize!');
    app.listen(porta, () => {
      logger.sucesso(`Servidor rodando na porta ${porta}`);
      logger.info(`Documentação Swagger ativa em: http://localhost:${portaGateway}/api-docs`);
    });
  })
  .catch((error) => {
    logger.error('Erro ao conectar e sincronizar com o PostgreSQL:', error);
  });