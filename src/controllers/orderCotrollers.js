const Order = require("../models/Order");
const MenuItem = require("../models/MenuItems");
const Restaurant = require("../models/Restaurant");
const User = require("../models/Users");

// CREATE ORDER (USER)
exports.createOrder = async (req, res) => {
    try {
        const { items, restaurantId, deliveryAddress  } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No items added" });
        }

        if (!restaurantId) {
            return res.status(400).json({ error: "Restaurant is required" });
        }

        if (!deliveryAddress) {
            return res.status(400).json({ error: "Delivery address is required" });
        }
        // Restaurant exists?
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // User info
        const user = await User.findById(req.user.id).select("name email");

        // Extract all menu item IDs
        const menuItemIds = items.map(i => i.menuItem);

        // Fetch all menu items in ONE QUERY
        const menus = await MenuItem.find({ _id: { $in: menuItemIds } });

        if (menus.length !== items.length) {
            return res.status(404).json({ error: "One or more menu items not found" });
        }

        // Check all items belong to same restaurant
        for (let m of menus) {
            if (m.restaurant.toString() !== restaurantId.toString()) {
                return res.status(400).json({ error: "Menu items do not belong to this restaurant" });
            }
        }

        // Build final order items + total
        let total = 0;
        const orderItems = menus.map(menu => {
            const qty = items.find(i => i.menuItem === menu._id.toString()).quantity || 1;
            total += menu.price * qty;

            return {
                menuItem: menu._id,
                name: menu.name,
                price: menu.price,
                quantity: qty
            };
        });

        const order = await Order.create({
            user: {
                id: req.user.id,
                name: user.name,
                email: user.email
            },
            restaurant: restaurantId,
            items: orderItems,
            total,
            status: "pending"
        });

        res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("restaurant")
            .populate("items.menuItem");

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET ORDER BY ID (USER)
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("restaurant")
            .populate("items.menuItem");

        if (!order) return res.status(404).json({ error: "Order not found" });

        if (order.user.id.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ error: "Not allowed" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE ORDER (ADMIN)
exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id);

        if (!deleted) return res.status(404).json({ error: "Order not found" });

        res.json({ message: "Order deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// GET MY ORDERS (USER)
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const myOrders = await Order.find({ "user.id": userId })
            .populate("restaurant")
            .populate("items.menuItem")
            .sort({ createdAt: -1 }); // latest first

        if (myOrders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.json({
            message: "My orders fetched successfully",
            orders: myOrders
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
