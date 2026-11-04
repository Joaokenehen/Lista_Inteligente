import { Router } from 'express';
import { ListaControlador } from '../controllers/lista.controller';
import { autenticarJwt } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de lista são protegidas por JWT
router.use(autenticarJwt);

/**
 * @swagger
 * /listas:
 *   get:
 *     summary: Lista as listas de compras do usuário autenticado
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lista'
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao buscar listas
 */
router.get('/', ListaControlador.listarPorUsuario);

/**
 * @swagger
 * /listas:
 *   post:
 *     summary: Cria uma lista para o usuário autenticado
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo:
 *                 type: string
 *                 maxLength: 120
 *                 example: Compras da semana
 *     responses:
 *       201:
 *         description: Lista criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lista'
 *       400:
 *         description: Título ausente ou inválido
 *       401:
 *         description: Token ausente, inválido ou expirado
 *       500:
 *         description: Erro ao criar lista
 */
router.post('/', ListaControlador.criarLista);

export default router;