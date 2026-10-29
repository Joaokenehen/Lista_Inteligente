import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { sequelize } from '../config/banco';

export class UsuarioModel extends Model<InferAttributes<UsuarioModel>, InferCreationAttributes<UsuarioModel>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare senhaHash: string;
  declare perfil: CreationOptional<string>;
  declare criadoEm: CreationOptional<Date>;
}

UsuarioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.STRING,
      defaultValue: 'USUARIO',
    },
    criadoEm: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criadoEm',
    updatedAt: false,
  }
);