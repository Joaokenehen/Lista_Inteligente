import { Application } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const porta = process.env.AUTH_SERVICE_PORT || 3001;

const opcoesSwagger: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Lista Inteligente - Serviço IAM',
      version: '1.0.0',
      description: 'API de Autenticação e Gestão de Contas do App Lista Inteligente.',
    },
    servers: [
      {
        url: `http://localhost:${porta}`,
        description: 'Servidor Local (Docker Container)',
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