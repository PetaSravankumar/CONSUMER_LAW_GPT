const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TokenModel = require("../models/tokenModel");
const logger = require("../utils/logger");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

// 🍪 Common cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

/**
 * ✅ Signup Controller
 * @route POST /auth/signup
 */
const signupUser = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, name });
    await newUser.save();

    logger.info("New user registered: %s", email);
    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    logger.error("Signup error: %s", err.message, { error: err });
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * ✅ Login Controller
 * @route POST /auth/login
 */
const loginUser = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 💾 Save refresh token in DB
    await TokenModel.create({ userId: user._id, token: refreshToken });

    // 🍪 Send refresh token in cookie
    res
      .cookie("refreshToken", refreshToken, getCookieOptions())
      .json({ accessToken });

    logger.info("User logged in: %s", email);
  } catch (err) {
    logger.error("Login error: %s", err.message, { error: err });
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 🔁 Refresh Token Controller
 * @route GET /auth/refresh
 */
const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh Token required" });
  }

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // ✅ Check token in DB
    const storedToken = await TokenModel.findOne({ userId: payload.userId, token });
    if (!storedToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(payload.userId);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    logger.warn("Refresh token error: %s", err.message, { error: err });
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

/**
 * 🚪 Logout Controller
 * @route POST /auth/logout
 */
const logoutUser = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(200).json({ message: "No active session" }); // Better for frontend logic
  }

  try {
    // ❌ Delete token from DB
    await TokenModel.deleteOne({ token });

    // 🧹 Clear cookie
    res.clearCookie("refreshToken", getCookieOptions());

    logger.info("User logged out");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    logger.error("Logout error: %s", err.message, { error: err });
    res.status(500).json({ message: "Logout failed" });
  }
};

// 📤 Export controllers
module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  refreshToken,
};
