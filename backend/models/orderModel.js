const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Order = sequelize.define("Order", {

  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },

  buyer_id: {
    type: DataTypes.UUID,
    allowNull: false
  },

  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending"
  }

}, {
  tableName: "orders",
  timestamps: true
});

module.exports = Order;