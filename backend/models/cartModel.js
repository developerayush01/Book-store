const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Cart=sequelize.define("Cart",{
    id:{
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },

  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },

  book_id: {
    type: DataTypes.UUID,
    allowNull: false
  },

  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
}

},
  {
  tableName: "cart",
  timestamps: true
  });

  module.exports = Cart;
