import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';

const dbName = process.env.DB_NAME || 'cartflow_lists';
const dbUser = process.env.DB_USER || 'root';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPassword = process.env.DB_PASS || 'root_admin';
const dbPort = Number(process.env.DB_PORT) || 3306;

// Garante a criação do banco de dados caso ele não exista
async function criarBancoSeNaoExistir() {
  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  await connection.end();
}

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
});

export const conectarBanco = async () => {
  try {
    await criarBancoSeNaoExistir();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('[lists-service] Banco de dados MySQL conectado e sincronizado.');
  } catch (error) {
    console.error('[lists-service] Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};