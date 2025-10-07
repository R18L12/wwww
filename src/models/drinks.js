import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Drink = sequelize.define("Drink", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // optional if not every drink has an image
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true, // e.g. "Smoothie", "Juice", etc.
  },
  available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Admin can toggle availability later
  },
});

export default Drink;
