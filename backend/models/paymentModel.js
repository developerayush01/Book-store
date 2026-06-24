const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");


const Transaction = sequelize.define("Transaction", {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "users", key: "id" },
  },
  book_ids: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 },
  },
  address_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "address", key: "id" },
  onDelete: "SET NULL",
  },
  transaction_uuid: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  esewa_transaction_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  payment_gateway: {
    type: DataTypes.ENUM("esewa", "khalti"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "REFUNDED"),
    allowNull: false,
    defaultValue: "PENDING",
  },
}, { timestamps: true });

module.exports = Transaction;