import express from 'express';
import cors from 'cors';
import { configurarSwagger } from './config/swagger';
import listaRoutes from './routes/lista.routes';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.get('/listas/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

configurarSwagger(app);
app.use('/listas', listaRoutes);

export default app;