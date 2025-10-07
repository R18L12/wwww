import express from "express";
import {
  getAllDrinks,
  addDrink,
  updateDrink,
  deleteDrink,
} from "../controllers/drinkController.js"; // ✅ Correct names
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Public route — anyone can view drinks
router.get("/", getAllDrinks);

// 🔒 Admin-only routes — protected by token + admin check
router.post("/", verifyToken, isAdmin, addDrink);
router.put("/:id", verifyToken, isAdmin, updateDrink);
router.delete("/:id", verifyToken, isAdmin, deleteDrink);

export default router;
