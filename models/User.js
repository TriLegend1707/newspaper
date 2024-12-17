const { DataTypes } = require("sequelize");
const db = require("../config/db");

const User = db.define("User", {
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
  role: {
    type: DataTypes.ENUM("guest", "subscriber", "writer", "editor", "admin"),
    defaultValue: "guest",
  },
  subscription_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;
