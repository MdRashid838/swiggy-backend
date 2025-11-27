const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    registerAdmin,
    loginAdmin,
    getProfile
} = require("../controllers/usersControllers");

const { verifyToken, verifyAdmin, verifyUser } = require("../middleware/auth");


// ------------------ ADMIN ROUTES ------------------

// REGISTER ADMIN  (Public OR can be disabled after first admin)
router.post("/admin/register", registerAdmin);

// LOGIN ADMIN
router.post("/admin/login", loginAdmin);

// ADMIN ONLY TEST / DASHBOARD
router.get("/admin/dashboard", verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: "Welcome Admin" });
});


// ------------------ USER ROUTES ------------------

// REGISTER USER
router.post("/register", registerUser);

// LOGIN USER
router.post("/login", loginUser);

// USER PROFILE (User Only)
router.get("/profile", verifyToken, verifyUser, getProfile);


// ------------------ COMMON PROFILE (Admin + User) ------------------
router.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: "Profile Access", user: req.user });
});


module.exports = router;
