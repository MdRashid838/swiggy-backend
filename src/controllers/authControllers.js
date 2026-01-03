const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  sendEmail  = require("../utils/sendEmail");
const { generateOTP, hashOTP } = require("../utils/otp");
const sendOtpEmail = require("../utils/sendOtpEmail");
// const generateOtp = require("../utils/generateOtp");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// ------------------ REGISTER ADMIN (Only One Allowed) ------------------
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Only one admin allowed in the entire system",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ LOGIN ADMIN ------------------
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 1️⃣ SEND OTP
exports.sendForgetPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    user.isOtpVerified = false; // 🔥 IMPORTANT RESET

    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("FORGET PASSWORD ERROR:", error);
    res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
};

// 2️⃣ VERIFY OTP
exports.verifyForgetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 🔥 IMPORTANT FIX
    user.isOtpVerified = true;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// 3️⃣ RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(403).json({ message: "OTP not verified" });
    }

    // ❌ bcrypt.hash MAT lagana
    // ✅ model ka pre-save hook automatically hash karega
    user.password = newPassword;

    // cleanup
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    user.isOtpVerified = false;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// send update password otp
exports.sendUpdatePasswordOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOTP();

  user.resetOtp = otp;
  user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
  user.isOtpVerified = false;

  await user.save();

  await sendEmail(email, "Update Password OTP", `OTP: ${otp}`);

  res.json({ message: "OTP sent for password update" });
};

// otp verify update password
exports.verifyUpdatePasswordOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    resetOtp: otp,
    resetOtpExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isOtpVerified = true;
  await user.save();

  res.json({ message: "OTP verified" });
};

// update password 
exports.updatePassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await User.findOne({ email });

  if (!user || !user.isOtpVerified) {
    return res.status(403).json({ message: "OTP not verified" });
  }

  user.password = newPassword; // pre-save hook will hash
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;
  user.isOtpVerified = false;

  await user.save();

  res.json({ message: "Password updated successfully" });
};
