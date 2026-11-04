import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { conectarBanco } from './config/banco';

const PORT = process.env.PORT || 3002;

conectarBanco().then(() => {
  app.listen(PORT, () => {
    console.log(`[lists-service] Rodando na porta ${PORT}`);
  });
});