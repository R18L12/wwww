import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.js";
import User from "./models/user.js"; 
import Drink from "./models/drinks.js"; 
import drinkRoutes from "./routes/drink.js";
import cartRoutes from "./routes/cart.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/drinks", drinkRoutes);
app.use("/api/cart", cartRoutes);


// ✅ Test route
app.get("/", (req, res) => {
  res.send("Drink Shop Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

// ✅ Database connection and model sync
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  // ✅ Sync all models after connection
  .then(() => sequelize.sync({ alter: true }))
  .then(() => console.log("✅ All models synchronized successfully"))
  .catch((err) => console.log("❌ Error connecting to the database:", err));

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
