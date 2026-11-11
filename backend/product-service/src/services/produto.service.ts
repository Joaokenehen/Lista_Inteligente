import { Produto } from '../models/produto.model';
import { Op } from 'sequelize';

export class ProdutoService {
  async criar(dados: Partial<Produto>) {
    return await Produto.create(dados as any);
  }

  async listar(busca?: string, categoria?: string, pagina = 1, limite = 20) {
    const offset = (pagina - 1) * limite;
    const where: any = {};

    if (busca) {
      where.nome = { [Op.like]: `%${busca}%` };
    }

    if (categoria) {
      where.categoria = categoria;
    }

    const { rows: produtos, count: total } = await Produto.findAndCountAll({
      where,
      limit: Number(limite),
      offset: Number(offset),
      order: [['nome', 'ASC']],
    });

    return {
      produtos,
      total,
      pagina: Number(pagina),
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async buscarPorId(id: number) {
    const produto = await Produto.findByPk(id);
    if (!produto) {
      const erro: any = new Error('Produto não encontrado.');
      erro.status = 404;
      throw erro;
    }
    return produto;
  }

  async atualizar(id: number, dados: Partial<Produto>) {
    const produto = await this.buscarPorId(id);
    return await produto.update(dados);
  }

  async deletar(id: number) {
    const produto = await this.buscarPorId(id);
    await produto.destroy();
    return { mensagem: 'Produto removido com sucesso.' };
  }
}