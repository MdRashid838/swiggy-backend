const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");
const {
  sendForgetPasswordOtp,
  verifyForgetPasswordOtp,
  resetPassword
} = require("../controllers/authControllers");
const { verifyToken } = require("../middleware/auth");
const { body } = require("express-validator");

// ==================================================
// ================= USER REGISTER ===================
// ==================================================

// STEP 1: SEND OTP (EMAIL ONLY)
router.post(
  "/register/send-otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
  ],
  usersController.sendRegisterOtp
);

// STEP 2: VERIFY OTP
router.post(
  "/register/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp").notEmpty().withMessage("OTP required"),
  ],
  usersController.verifyRegisterOtp
);

// STEP 3: SET PASSWORD
router.post(
  "/register/set-password",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
    body("name").optional(),
  ],
  usersController.setPassword
);

// ==================================================
// ================= USER LOGIN ======================
// ==================================================

// LOGIN WITH PASSWORD
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  usersController.loginUser
);

// LOGIN WITH OTP → SEND OTP
router.post(
  "/login/send-otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
  ],
  usersController.sendLoginOtp
);

// LOGIN WITH OTP → VERIFY OTP
router.post(
  "/login/otp",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("otp").notEmpty().withMessage("OTP required"),
  ],
  usersController.loginWithOtp
);

// ==================================================
// ================= USER PROFILE ====================
// ==================================================

router.get("/profile", verifyToken, usersController.getProfile);

// forget password
router.post("/forgot-password", sendForgetPasswordOtp);
router.post("/verify-otp", verifyForgetPasswordOtp);
router.post("/reset-password", resetPassword);


// upadate password
router.post("/update-password/send-otp", sendForgetPasswordOtp);
router.post("/update-password/verify-otp", verifyForgetPasswordOtp);
router.post("/update-password", resetPassword);

module.exports = router;
