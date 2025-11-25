const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
    console.error("❌ ERROR: JWT_SECRET missing in .env file");
    process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

// ---------------- VERIFY TOKEN ----------------
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token missing"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        // decoded = { id, role, name, email, iat, exp }
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// ---------------- ADMIN ONLY ----------------
exports.verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access denied" });
    }

    next();
};

// ---------------- USER ONLY ----------------
exports.verifyUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (req.user.role !== "user") {
        return res.status(403).json({ success: false, message: "User access denied" });
    }

    next();
};
