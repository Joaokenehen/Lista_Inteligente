import { Request, Response } from 'express';
import { AutenticacaoServico, DadosUsuarioToken } from '../services/auth.service';
import { UsuarioModel } from '../models/usuario.model';
import { RequisicaoAutenticada } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';

export class AutenticacaoControlador {

  // POST /auth/logout
  static async encerrarSessao(req: RequisicaoAutenticada, res: Response) {
    const usuario = req.usuario;

    if (!usuario) {
      logger.alerta('Tentativa de logout sem usuário autenticado.');
      return res.status(401).json({ error: 'Sessão não autenticada.' });
    }

    logger.sucesso(
      `Logout solicitado para usuário ID ${usuario.id}; o cliente descartará o JWT, que permanece válido até expirar.`
    );

    return res.status(200).json({ mensagem: 'Logout registrado com sucesso.' });
  }
  
  // POST /auth/cadastrar
  static async cadastrarUsuario(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body ?? {};

      if (
        typeof nome !== 'string' ||
        typeof email !== 'string' ||
        typeof senha !== 'string' ||
        !nome.trim() ||
        !email.trim() ||
        !senha
      ) {
        logger.alerta('Tentativa de cadastro com campos obrigatórios ausentes.');
        return res.status(400).json({ error: 'Os campos nome, email e senha são obrigatórios.' });
      }

      const nomeNormalizado = nome.trim();
      const emailNormalizado = email.trim().toLowerCase();
      const senhaValida =
        senha.length >= 8 &&
        /[A-Z]/.test(senha) &&
        /[^A-Za-z0-9\s]/.test(senha);

      if (nomeNormalizado.length > 100) {
        return res.status(400).json({ error: 'O nome deve ter no máximo 100 caracteres.' });
      }

      if (emailNormalizado.length > 254 || !/^[^\s@]+@[^\s@]+\.com$/i.test(emailNormalizado)) {
        return res.status(400).json({ error: 'Informe um e-mail válido terminado em .com.' });
      }

      if (!senhaValida || senha.length > 128) {
        return res.status(400).json({
          error: 'A senha deve ter entre 8 e 128 caracteres, uma letra maiúscula e um caractere especial.',
        });
      }

      logger.info(`Processando cadastro para o e-mail: ${emailNormalizado}`);

      const usuarioJaExiste = await UsuarioModel.findOne({ where: { email: emailNormalizado } });

      if (usuarioJaExiste) {
        logger.alerta(`Cadastro recusado: O e-mail ${emailNormalizado} já está em uso.`);
        return res.status(409).json({ error: 'Este e-mail já está em uso por outra conta.' });
      }

      const senhaHash = await AutenticacaoServico.gerarHashSenha(senha);

      const novoUsuario = await UsuarioModel.create({
        nome: nomeNormalizado,
        email: emailNormalizado,
        senhaHash,
        perfil: 'USUARIO',
      });

      logger.sucesso(`Usuário ${emailNormalizado} (ID: ${novoUsuario.id}) cadastrado com sucesso!`);

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          perfil: novoUsuario.perfil,
        },
      });
    } catch (error) {
      logger.error('Falha interna no cadastro de usuário:', error);
      return res.status(500).json({ error: 'Erro interno ao realizar cadastro.' });
    }
  }

  // POST /auth/login
  static async realizarLogin(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        logger.alerta('Tentativa de login sem informar e-mail ou senha.');
        return res.status(400).json({ error: 'Informe e-mail e senha para acessar.' });
      }

      logger.info(`Tentativa de autenticação para: ${email}`);

      const usuarioEncontrado = await UsuarioModel.findOne({ where: { email } });

      if (!usuarioEncontrado) {
        logger.alerta(`Falha de login: Usuário ${email} não encontrado.`);
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const senhaCorreta = await AutenticacaoServico.validarSenha(senha, usuarioEncontrado.senhaHash);
      if (!senhaCorreta) {
        logger.alerta(`Falha de login: Senha incorreta para o e-mail ${email}.`);
        return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
      }

      const dadosPayload: DadosUsuarioToken = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        perfil: usuarioEncontrado.perfil,
      };

      const tokenAcesso = AutenticacaoServico.gerarTokenJwt(dadosPayload);

      logger.sucesso(`Autenticação bem-sucedida para: ${email}`);

      return res.status(200).json({
        mensagem: 'Login efetuado com sucesso!',
        token: tokenAcesso,
        usuario: dadosPayload,
      });
    } catch (error) {
      logger.error('Falha interna no login:', error);
      return res.status(500).json({ error: 'Erro interno ao realizar login.' });
    }
  }

  // POST /auth/validar
  static async validarSessaoToken(req: Request, res: Response) {
    try {
      let token = '';
      const cabecalhoAutorizacao = req.headers.authorization;

      if (cabecalhoAutorizacao && cabecalhoAutorizacao.startsWith('Bearer ')) {
        token = cabecalhoAutorizacao.split(' ')[1];
      } else if (req.body && req.body.token) {
        token = req.body.token;
      }

      if (!token) {
        logger.alerta('Validação de token recusada: Nenhum token fornecido.');
        return res.status(401).json({ valido: false, error: 'Token de acesso não fornecido.' });
      }

      const usuarioDecodificado = AutenticacaoServico.verificarTokenJwt(token);

      logger.sucesso(`Token JWT validado com sucesso para o usuário ID: ${usuarioDecodificado.id}`);

      return res.status(200).json({
        valido: true,
        usuario: usuarioDecodificado,
      });
    } catch (error) {
      logger.alerta('Validação de token falhou: Token inválido ou expirado.');
      return res.status(401).json({ valido: false, error: 'Token inválido ou expirado.' });
    }
  }
}