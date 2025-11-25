const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersControllers");
const { verifyToken } = require("../middleware/auth");
const { body } = require("express-validator");

// USER REGISTER
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  ],
  usersController.registerUser
);

// USER LOGIN
router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  usersController.loginUser
);

// USER PROFILE
router.get("/profile", verifyToken, usersController.getProfile);

module.exports = router;
