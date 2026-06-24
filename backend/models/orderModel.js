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

  delivery_street: {
    type: DataTypes.STRING,
    allowNull: true
  },

  delivery_city: {
    type: DataTypes.STRING,
    allowNull: true
  },

  delivery_district: {
    type: DataTypes.STRING,
    allowNull: true
  },

  delivery_province: {
    type: DataTypes.STRING,
    allowNull: true
  },

  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  status: {
    type:DataTypes.ENUM("Pending","Completed","Cancelled"),
    defaultValue:"Pending"
  }

}, {
  tableName: "orders",
  timestamps: true
});

module.exports = Order;