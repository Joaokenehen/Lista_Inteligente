import { Request, Response, NextFunction } from 'express';
import { ProdutoService } from '../services/produto.service';

const produtoService = new ProdutoService();

export class ProdutoController {
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const produto = await produtoService.criar(req.body);
      return res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { busca, categoria, pagina, limite } = req.query;
      const resultado = await produtoService.listar(
        busca as string,
        categoria as string,
        pagina ? Number(pagina) : 1,
        limite ? Number(limite) : 20
      );
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async buscarPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.buscarPorId(id);
      return res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }

  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const produto = await produtoService.atualizar(id, req.body);
      return res.status(200).json(produto);
    } catch (error) {
      next(error);
    }
  }

  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const resultado = await produtoService.deletar(id);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}