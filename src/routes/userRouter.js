const express = require("express");
const router = express.Router();
const profileImage = require("../middleware/profiles");

const {
    // ---------- USER ----------
    sendRegisterOtp,
    verifyRegisterOtp,
    setPassword,
    loginUser,          // email + password
    sendLoginOtp,
    loginWithOtp,
    getProfile,
    updateProfile,

    // ---------- ADMIN ----------
    registerAdmin,      // send OTP (fixed email)
    verifyAdminOtp,
    loginAdmin
} = require("../controllers/usersControllers");

const {
    verifyToken,
    verifyAdmin,
    verifyUser
} = require("../middleware/auth");


// ==================================================
// ================== ADMIN ROUTES ==================
// ==================================================

// SEND OTP TO FIXED ADMIN EMAIL
router.post("/admin/register", registerAdmin);

// VERIFY ADMIN OTP + SET PASSWORD
router.post("/admin/verify-otp", verifyAdminOtp);

// ADMIN LOGIN (email + password)
router.post("/admin/login", loginAdmin);

// ADMIN DASHBOARD (protected)
router.get(
    "/admin/dashboard",
    verifyToken,
    verifyAdmin,
    (req, res) => {
        res.json({ message: "Welcome Admin" });
    }
);


// ==================================================
// =================== USER ROUTES ===================
// ==================================================

// STEP 1: USER ENTER EMAIL → SEND OTP
router.post("/register/send-otp", sendRegisterOtp);

// STEP 2: VERIFY OTP
router.post("/register/verify-otp", verifyRegisterOtp);

// STEP 3: SET PASSWORD (FINAL REGISTER)
router.post("/register/set-password", setPassword);

// LOGIN WITH PASSWORD
router.post("/login", loginUser);

// LOGIN WITH OTP (STEP 1: SEND OTP)
router.post("/login/send-otp", sendLoginOtp);

// LOGIN WITH OTP (STEP 2: VERIFY OTP)
router.post("/login/otp", loginWithOtp);

// USER PROFILE (User only)
// router.get(
//     "/profile",
//     verifyToken,
//     verifyUser,
//     getProfile
// );


// ==================================================
// =========== COMMON (ADMIN + USER) ================
// ==================================================
router.get("/profile", verifyToken, getProfile);
router.patch("/profile",verifyToken , profileImage.single("image"), updateProfile);


router.get("/dashboard", verifyToken, (req, res) => {
    res.json({
        message: "Dashboard Access",
        user: req.user
    });
});

module.exports = router;
