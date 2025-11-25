const express = require("express");
const router = express.Router();

const {
    getAllMenuItems,
    getMenuItemsByRestaurant,
    createMenuItem,
    getSingleMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require("../controllers/menuItemControllers");

const { verifyToken, verifyAdmin } = require("../middleware/auth");


// --------------------- PUBLIC ROUTES ---------------------

// All menu items
router.get("/", getAllMenuItems);

// Get items of a restaurant
router.get("/restaurant/:id", getMenuItemsByRestaurant);

// Single menu item
router.get("/:id", getSingleMenuItem);


// --------------------- ADMIN ROUTES ---------------------

// Create new menu item
router.post("/", verifyToken, verifyAdmin, createMenuItem);

// Update menu item
router.put("/:id", verifyToken, verifyAdmin, updateMenuItem);

// Delete menu item
router.delete("/:id", verifyToken, verifyAdmin, deleteMenuItem);


module.exports = router;
