const express = require("express");
const router = express.Router();

const {
    createOrder,
    getAllOrders,
    getOrderById,
    deleteOrder,
    getMyOrders
} = require("../controllers/orderCotrollers");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

// USER: Create new order
router.post("/", verifyToken, createOrder);

// ADMIN: Get all orders
router.get("/", verifyToken, verifyAdmin, getAllOrders);

// USER: Get own orders
router.get("/my", verifyToken, getMyOrders);

// USER or ADMIN: Get order by ID
router.get("/:id", verifyToken, getOrderById);

// ADMIN: Delete order
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

module.exports = router;
