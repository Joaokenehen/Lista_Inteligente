import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { configurarSwagger } from './config/swagger';
import rotasProdutos from './routes/produto.routes';
import { sequelize } from './config/banco';
import { logger } from './utils/logger';
import { limitadorGeral } from './middlewares/rateLimit.middleware';
import { manipuladorGlobalErros } from './middlewares/erro.middleware';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const porta = process.env.PRODUCT_SERVICE_PORT || 3003;
const portaGateway = process.env.GATEWAY_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(limitadorGeral);

// Middleware global de logs HTTP
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

app.use('/produtos', rotasProdutos);
app.use(manipuladorGlobalErros);

sequelize.sync()
  .then(() => {
    logger.sucesso('MySQL sincronizado com sucesso via Sequelize (product-service)!');
    app.listen(porta, () => {
      logger.sucesso(`Servidor de Produtos rodando na porta ${porta}`);
      logger.info(`Documentação Swagger ativa em: http://localhost:${portaGateway}/api-docs/produtos`);
    });
  })
  .catch((error) => {
    logger.error('Erro ao conectar e sincronizar com o MySQL:', error);
  });