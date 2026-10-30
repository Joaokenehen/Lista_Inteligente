import { Router } from 'express';
import { AutenticacaoControlador } from '../controllers/auth.controller';
import { verificarAutenticacao, RequisicaoAutenticada } from '../middlewares/auth.middleware';
import { limitadorAutenticacao } from '../middlewares/rateLimit.middleware';

const roteador = Router();

/**
 * @swagger
 * /auth/cadastrar:
 *   post:
 *     summary: Cadastra um novo usuário no Lista Inteligente
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Gustavo
 *               email:
 *                 type: string
 *                 example: joao@listainteligente.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado
 *       429:
 *         description: Muitas tentativas de requisição
 */
roteador.post('/cadastrar', limitadorAutenticacao, AutenticacaoControlador.cadastrarUsuario);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login e devolve o Token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@listainteligente.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas tentativas de login
 */
roteador.post('/login', limitadorAutenticacao, AutenticacaoControlador.realizarLogin);

/**
 * @swagger
 * /auth/validar:
 *   post:
 *     summary: Valida a integridade do token JWT informado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token ausente, inválido ou expirado
 */
roteador.post('/validar', AutenticacaoControlador.validarSessaoToken);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Retorna o perfil do usuário logado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado. Retorna os dados do token decodificado.
 *       401:
 *         description: Acesso negado. Token ausente, inválido ou expirado.
 */
roteador.get('/perfil', verificarAutenticacao, (req: RequisicaoAutenticada, res) => {
  return res.status(200).json({
    mensagem: 'Acesso concedido à rota privada!',
    usuario: req.usuario,
  });
});

export default roteador;