import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/lista_inteligente_db';

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Desativa logs de SQL no terminal para manter a saída limpa
});