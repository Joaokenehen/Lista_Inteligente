import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/banco';

export class ListaModel extends Model {
  public id!: number;
  public usuarioId!: number;
  public titulo!: string;
  public status!: 'ATIVA' | 'CONCLUIDA' | 'ARQUIVADA';
}

ListaModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ATIVA', 'CONCLUIDA', 'ARQUIVADA'),
      defaultValue: 'ATIVA',
    },
  },
  {
    tableName: 'listas',
    sequelize,
  }
);