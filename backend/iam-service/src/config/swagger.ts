import { Application } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const opcoesSwagger: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lista Inteligente - Serviço IAM',
      version: '1.0.0',
      description: 'API de Autenticação e Gestão de Contas do App Lista Inteligente.',
    },
    servers: [
      {
        url: 'http://10.0.2.95:3000',
        description: 'Servidor Fedora (Gateway Nginx - Porta 3000)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Acesso Local (Gateway Nginx - Porta 3000)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const documentacaoSwagger = swaggerJsDoc(opcoesSwagger);

export const configurarSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(documentacaoSwagger));
};