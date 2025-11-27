const express = require("express");
const router = express.Router();

const {
    getAllMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenuItems,
    getMenuItemById
} = require("../controllers/menuItemControllers");

const { verifyToken, verifyAdmin } = require("../middleware/auth");


// --------------------- PUBLIC ROUTES ---------------------

// All menu items
router.get("/",getAllMenuItems);

// Get items of a restaurant
// router.get("/restaurant/:id", getMenuItemsByRestaurant);

// Single menu item
// router.get("/:id", getSingleMenuItem);

// GET all menu items with filters
router.get("/", getMenuItems);

// GET single menu item by ID
router.get("/", getMenuItemById);


// --------------------- ADMIN ROUTES ---------------------

// Create new menu item
router.post("/", createMenuItem);

// Update menu item
router.put("/:id", updateMenuItem);

// Delete menu item
router.delete("/:id", verifyToken, verifyAdmin, deleteMenuItem);


module.exports = router;
