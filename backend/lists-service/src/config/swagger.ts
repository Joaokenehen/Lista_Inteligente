import { Application } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const opcoesSwagger: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CartFlow - Serviço de Listas',
      version: '1.0.0',
      description: 'API para criação e consulta das listas de compras do usuário.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Gateway local',
      },
      {
        url: 'http://10.0.2.95:3000',
        description: 'Gateway no servidor',
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
      schemas: {
        Lista: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            usuarioId: { type: 'integer', example: 7 },
            titulo: { type: 'string', maxLength: 120, example: 'Compras da semana' },
            status: {
              type: 'string',
              enum: ['ATIVA', 'CONCLUIDA', 'ARQUIVADA'],
              example: 'ATIVA',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsDoc(opcoesSwagger);

export const configurarSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
