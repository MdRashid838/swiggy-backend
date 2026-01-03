const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtpEmail");

const JWT_SECRET = process.env.JWT_SECRET;

// // ==========================
// // ADMIN REGISTER (ONLY ONE)
// // ==========================
// exports.registerAdmin = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if any admin exists already
//         const adminExist = await User.findOne({ role: "admin" });
//         if (adminExist) {
//             return res.status(400).json({ message: "Only one admin allowed" });
//         }

//         // Check if email exists
//         const emailUsed = await User.findOne({ email });
//         if (emailUsed) {
//             return res.status(400).json({ message: "Email already in use" });
//         }

//         const admin = await User.create({
//             name,
//             email,
//             password,
//             role: "admin"
//         });

//         res.json({
//             success: true,
//             message: "Admin registered successfully",
//             admin: {
//                 id: admin._id,
//                 name: admin.name,
//                 email: admin.email,
//                 role: admin.role
//             }
//         });

//     } catch (e) {
//         res.status(500).json({ message: e.message });
//     }
// };

// // ==========================
// // ADMIN LOGIN
// // ==========================
// exports.loginAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const admin = await User.findOne({ email, role: "admin" }).select("+password");
//         if (!admin) return res.status(404).json({ message: "Admin not found" });

//         const match = await bcrypt.compare(password, admin.password);
//         if (!match) return res.status(400).json({ message: "Invalid credentials" });

//         const token = jwt.sign(
//             { id: admin._id, role: admin.role },
//             JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         res.json({
//             success: true,
//             message: "Admin login successful",
//             token,
//             admin: {
//                 id: admin._id,
//                 name: admin.name,
//                 email: admin.email,
//                 role: admin.role
//             }
//         });

//     } catch (e) {
//         res.status(500).json({ message: e.message });
//     }
// };

// ==========================
// ADMIN REGISTER (SEND OTP)
// ==========================
exports.registerAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    // 🔐 Fixed admin email check
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        message: "You are not allowed to become admin",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    let admin = await User.findOne({ email });

    if (admin) {
      // admin already exists but not verified
      if (admin.isVerified) {
        return res.status(400).json({
          message: "Admin already exists",
        });
      }

      admin.otp = otp;
      admin.otpExpiry = Date.now() + 5 * 60 * 1000;
      await admin.save();
    } else {
      // create temp admin
      await User.create({
        email,
        role: "admin",
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
        isVerified: false,
      });
    }

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to admin email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// VERIFY ADMIN OTP
// ==========================
exports.verifyAdminOtp = async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const admin = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Final admin setup
    admin.password = password; // bcrypt hook chalega
    admin.name = name || "Admin";
    admin.role = "admin";
    admin.isVerified = true;
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    res.json({
      success: true,
      message: "Admin verified & created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// ADMIN LOGIN
// ==========================
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Not an admin email" });
    }

    const admin = await User.findOne({ email }).select("+password");
    if (!admin || !admin.isVerified || admin.role !== "admin") {
      return res.status(401).json({ message: "Admin not verified" });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// SEND OTP (EMAIL ONLY)
// ==========================
exports.sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already registered" });
      }

      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;
      await user.save();
    } else {
      await User.create({
        email,
        otp,
        otpExpiry: Date.now() + 5 * 60 * 1000,
        role: "user",
        isVerified: false,
      });
    }

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// VERIFY OTP
// ==========================
exports.verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "OTP verified. Please set password",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// SET PASSWORD
// ==========================
exports.setPassword = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Password already set" });
    }

    user.password = password; // bcrypt pre-save hook
    user.name = name || "User";
    user.isVerified = true;

    await user.save();

    res.json({
      success: true,
      message: "Password set successfully. Registration completed",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// SEND LOGIN OTP
// ==========================
exports.sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res
        .status(404)
        .json({ message: "User not found or not verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({
      success: true,
      message: "Login OTP sent to email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// LOGIN WITH OTP
// ==========================
exports.loginWithOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    // THIS IS THE MISSING LINE
    email = email.toLowerCase();

    const user = await User.findOne({ email }).select("+otp +otpExpiry");
    if (!user || !user.isVerified) {
      return res
        .status(404)
        .json({ message: "User not found or not verified" });
    }

    if (!user.otp || String(user.otp).trim() !== String(otp).trim()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    if(user.otpExpiry < Date.now()){
        return res.status(401).json({massage:"Expired otp"})
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful (OTP)",
      token,
      user: {
        id: user._id,
        name:user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ==========================
// LOGIN WITH PASSWORD
// ==========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isVerified) {
      return res
        .status(404)
        .json({ message: "User not found or not verified" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Login successful (Password)",
      token,
      user: {
        id: user._id,
        name:user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROFILE (Admin + User)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;

    // FILE upload se image set karo
    if (req.file) {
      user.image = req.file.filename; // 👈 SIRF filename
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
