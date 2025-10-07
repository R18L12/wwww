import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Fallback defaults
const DB_NAME = process.env.DB_NAME || "mydb";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "password";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_DIALECT = process.env.DB_DIALECT || "mysql"; // default to mysql

// Debug: check environment variables
console.log("Database configuration:");
console.log({ DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT });

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false, // change to console.log to enable query logging
  dialectOptions: {
    // optional: handle SSL if using cloud DB
    // ssl: process.env.DB_SSL === "true"
  },
});

export default sequelize;
