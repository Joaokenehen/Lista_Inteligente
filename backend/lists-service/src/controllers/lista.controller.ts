import { Response } from 'express';
import { RequestAutenticado } from '../middlewares/auth.middleware';
import { ListaModel } from '../models/lista.model';

export class ListaControlador {
  // GET /listas
  static async listarPorUsuario(req: RequestAutenticado, res: Response) {
    try {
      const usuarioId = req.usuarioId!;
      const listas = await ListaModel.findAll({
        where: { usuarioId },
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(listas);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar listas.' });
    }
  }

  // POST /listas
  static async criarLista(req: RequestAutenticado, res: Response) {
    try {
      const usuarioId = req.usuarioId!;
      const { titulo } = req.body;

      if (!titulo) {
        return res.status(400).json({ error: 'O título da lista é obrigatório.' });
      }

      const novaLista = await ListaModel.create({
        usuarioId,
        titulo,
      });

      return res.status(201).json(novaLista);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar lista.' });
    }
  }
}