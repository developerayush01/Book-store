const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    ("Database connected successfully.");
    // Load relatinships
    require("../models/index");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  await sequelize.sync({ force: false, alter: false }).then(() => {
    ("All models were synchronized successfully.");
  });
};

module.exports = { sequelize, connectDB };
