const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const OrderItem = sequelize.define("OrderItem", {

  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },

  order_id: {
    type: DataTypes.UUID,
    allowNull: false
  },

  book_id: {
    type: DataTypes.UUID,
    allowNull: false
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }

}, {
  tableName: "order_items",
  timestamps: true
});

module.exports = OrderItem;