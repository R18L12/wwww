import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Verify JWT Token Middleware
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Check if logged-in user is the Admin
export const isAdmin = async (req, res, next) => {
  try {
    // Ensure user is attached from verifyToken
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - no user found" });
    }

    // Check if this user matches the admin credentials from .env
    const isAdminUser =
      req.user.email === process.env.ADMIN_EMAIL;

    if (!isAdminUser) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Optionally mark the user as admin for later use
    req.user.isAdmin = true;
    next();
  } catch (err) {
    console.error("❌ Admin verification failed:", err);
    res.status(500).json({ message: "Server error while checking admin status" });
  }
};
