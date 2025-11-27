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

// GET ALL MENU ITEMS WITH FILTER
exports.getMenuItems = async (req, res) => {
try {
const { category, minPrice, maxPrice, isVeg, isAvailable } = req.query;


// Build filter object dynamically
const filter = {};

if (category) filter.category = category;
if (isVeg !== undefined) filter.isVeg = isVeg === "true";
if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
if (minPrice || maxPrice) {
  filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
}

const menuItems = await MenuItem.find(filter).populate("restaurant", "name");

res.status(200).json({ success: true, data: menuItems });

} catch (error) {
console.error(error);
res.status(500).json({ success: false, message: "Server Error" });
}
};

// GET SINGLE MENU ITEM
exports.getMenuItemById = async (req, res) => {
try {
const menuItem = await MenuItem.findById(req.params.id).populate(
"restaurant",
"name"
);

```
if (!menuItem) {
  return res.status(404).json({ success: false, message: "Menu item not found" });
}

res.status(200).json({ success: true, data: menuItem });
```

} catch (error) {
console.error(error);
res.status(500).json({ success: false, message: "Server Error" });
}
};

