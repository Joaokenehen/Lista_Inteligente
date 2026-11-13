import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/banco';

export class Produto extends Model {
  public id!: number;
  public nome!: string;
  public categoria!: string;
  public codigoBarras?: string;
  public unidadeMedida!: string; // ex: 'UN', 'KG', 'L', 'PCT'
  public precoEstimado?: number;
}

Produto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'Geral',
    },
    codigoBarras: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'codigo_barras',
    },
    unidadeMedida: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'UN',
      field: 'unidade_medida',
    },
    precoEstimado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'preco_estimado',
    },
  },
  {
    sequelize,
    tableName: 'produtos',
    timestamps: true,
  }
);