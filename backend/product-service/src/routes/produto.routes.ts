import { Router } from 'express';
import { ProdutoController } from '../controllers/produto.controller';
import { autenticarJWT } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProdutoController();

router.use(autenticarJWT);

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;