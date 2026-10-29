import { Router } from 'express';
import { AutenticacaoControlador } from '../controllers/auth.controller';

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
 */
roteador.post('/cadastrar', AutenticacaoControlador.cadastrarUsuario);

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
 */
roteador.post('/login', AutenticacaoControlador.realizarLogin);

/**
 * @swagger
 * /auth/validar:
 *   post:
 *     summary: Valida a integridade do token JWT informado
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Token válido
 */
roteador.post('/validar', AutenticacaoControlador.validarSessaoToken);

export default roteador;