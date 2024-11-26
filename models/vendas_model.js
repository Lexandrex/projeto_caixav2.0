import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

// Definindo o modelo para a tabela 'vendas'
const Vendas = db.define('vendas', {
   id_venda: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
   },
   quantidade_12: {
      type: DataTypes.INTEGER,
      defaultValue: 0
   },
   quantidade_20: {
      type: DataTypes.INTEGER,
      defaultValue: 0
   },
  total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,  // Torna o total permitidos ser nulo, já que será gerado pelo banco de dados
        defaultValue: null
    },
   formaPagamento: {
      type: DataTypes.ENUM('dinheiro', 'cartao'),
      allowNull: false
   },
   data_hora: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
   }
}, {
   timestamps: false, // Não criar os campos 'createdAt' e 'updatedAt'
   freezeTableName: true // Manter o nome da tabela exatamente como 'vendas'
});

export default Vendas
