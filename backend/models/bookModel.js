const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const Book = sequelize.define("Book", {

  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  author: {
    type: DataTypes.STRING,
    allowNull: false
  },

  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  condition: {
    type: DataTypes.STRING
  },

  description: {
    type: DataTypes.TEXT
  },

  seller_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status:{
    type:DataTypes.ENUM("Available","Reserved","Sold"),
    defaultValue:"Available"
  }

}, {
  tableName: "books",
  timestamps: true
});

module.exports = Book;