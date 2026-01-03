const express = require("express");
const router = express.Router();

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantControllers");

const uploadRestaurant = require("../middleware/restaurant");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

// -------------------- ADMIN ONLY ROUTES --------------------

// CREATE RESTAURANT  (Admin Only)
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  uploadRestaurant.single("images"),
  createRestaurant
);

// UPDATE RESTAURANT  (Admin Only)
router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  uploadRestaurant.single("images"),
  updateRestaurant
);

// DELETE RESTAURANT  (Admin Only)
router.delete("/:id", verifyToken, verifyAdmin, deleteRestaurant);

// -------------------- PUBLIC ROUTES (Admin + User + Guest) --------------------

// GET ALL RESTAURANTS
router.get("/", getAllRestaurants);

// GET SINGLE RESTAURANT BY ID
router.get("/:id", getRestaurantById);

module.exports = router;
