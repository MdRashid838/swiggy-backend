const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================
// ADMIN REGISTER (ONLY ONE)
// ==========================
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if any admin exists already
        const adminExist = await User.findOne({ role: "admin" });
        if (adminExist) {
            return res.status(400).json({ message: "Only one admin allowed" });
        }

        // Check if email exists
        const emailUsed = await User.findOne({ email });
        if (emailUsed) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const admin = await User.create({
            name,
            email,
            password,
            role: "admin"
        });

        res.json({
            success: true,
            message: "Admin registered successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


// ==========================
// ADMIN LOGIN
// ==========================
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, role: "admin" }).select("+password");
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


// ==========================
// USER REGISTER
// ==========================
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create({ name, email, password });

        res.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ==========================
// USER LOGIN
// ==========================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ==========================
// GET PROFILE
// ==========================
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        res.json({
            success: true,
            data: user
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
