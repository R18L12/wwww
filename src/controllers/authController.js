import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// ✅ Signup controller
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      isAdmin: false, // ✅ normal user by default
    });

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      refreshToken,
      role: "user",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login controller (with Admin logic)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if the login is for Admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      // Check if admin already exists
      let admin = await User.findOne({ where: { email } });

      if (!admin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await User.create({
          username: "Admin",
          email,
          passwordHash: hashedPassword,
          isAdmin: true,
        });
      } else if (!admin.isAdmin) {
        admin.isAdmin = true;
        await admin.save();
      }

      const token = jwt.sign(
        { id: admin.id, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { id: admin.id, isAdmin: true },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Admin logged in successfully",
        token,
        refreshToken,
        role: "admin",
      });
    }

    // ✅ Normal user login
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      refreshToken,
      role: user.isAdmin ? "admin" : "user",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout controller
export const logout = async (req, res) => {
  try {
    // For JWT, logout is client-side (token removal)
    res.json({
      message: "Logout successful. Please remove the token on the client side.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// ✅ Refresh Token controller
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        message: "Access token refreshed successfully",
        token: newAccessToken,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Check who is logged in (Admin or User)
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: user.isAdmin ? "Logged in as Admin" : "Logged in as User",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Error fetching logged-in user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
