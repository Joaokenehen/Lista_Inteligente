import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export interface DadosUsuarioToken {
    id: number;
    nome: string;
    email: string;
    perfil: string;
};

export class AutenticacaoServico {
    private static RODADAS_SALT = 10;

    static async gerarHashSenha(senhaLimpa: string): Promise<string> {
        return await bcrypt.hash(senhaLimpa, this.RODADAS_SALT);
    };

    static async validarSenha(senhaLimpa: string, hashBanco: string): Promise<boolean> {
        return await bcrypt.compare(senhaLimpa, hashBanco);
    };

    static gerarTokenJwt(dadosUsuario: DadosUsuarioToken): string {
        const segredo = process.env.JWT_SECRET || 'chave_secreta_fallback';
        const tempoExpiracao = (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'];
        return jwt.sign(dadosUsuario, segredo, { expiresIn: tempoExpiracao});
    };

    static verificarTokenJwt(token: string): DadosUsuarioToken {
        const segredo = process.env.JWT_SECRET || 'chave_secreta_fallback';
        return jwt.verify(token, segredo) as DadosUsuarioToken;
    };
};

