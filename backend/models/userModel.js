const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },

  profilePicture: {
    type: DataTypes.STRING,
    allowNull: true
},

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
is_verified: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},
verification_token: {
  type: DataTypes.STRING,
  allowNull: true,
},
verification_token_expiry: {
  type: DataTypes.DATE,
  allowNull: true,
},
}, {
  tableName: "users",
  timestamps: true
});

module.exports = User;