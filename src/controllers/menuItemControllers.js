const MenuItem = require("../models/MenuItems");
const Restaurant = require("../models/Restaurant");

// GET ALL MENU ITEMS (Public)
exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find().populate("restaurant", "name cuisine");
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET ITEMS BY RESTAURANT (Public)
exports.getMenuItemsByRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const items = await MenuItem.find({ restaurant: id });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE MENU ITEM (Admin Only)
exports.createMenuItem = async (req, res) => {
    try {
        const { restaurant, name, description, price, image, isVeg , deliveryTime } = req.body;

        // Validate required fields
        if (!restaurant || !name || !price || !image) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if restaurant exists
        const rest = await Restaurant.findById(restaurant);
        if (!rest) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        const item = await MenuItem.create({
            restaurant,
            name,
            description,
            price,
            image,
            isVeg,
            deliveryTime
        });

        res.status(201).json({
            message: "Menu item created successfully",
            item
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET SINGLE MENU ITEM (Public)
exports.getSingleMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        res.json(item);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE MENU ITEM (Admin Only)
exports.updateMenuItem = async (req, res) => {
    try {
        const updated = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        res.json({
            message: "Menu item updated successfully",
            updated
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE MENU ITEM (Admin Only)
exports.deleteMenuItem = async (req, res) => {
    try {
        const deleted = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        res.json({ message: "Menu item deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
