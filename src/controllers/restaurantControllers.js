const Restaurant = require("../models/Restaurant");

// CREATE RESTAURANT (ADMIN ONLY)
async function createRestaurant (req, res) {
  try {
    const imageUrl = req.file ? req.file.path : null;

    const newRest = await Restaurant.create({
      name: req.body.name,
      rating: req.body.rating,
      ratingCount: req.body.ratingCount,
      isOpen: req.body.isOpen,
      images: imageUrl ? [imageUrl] : [],
      location: {
        address: req.body.address,
        lat: req.body.lat,
        lng: req.body.lng
      }
    });

    res.status(201).json({ success: true, data: newRest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET ALL + FILTERS (USER + ADMIN)
async function getAllRestaurants(req, res) {
  try {
    const { q, cuisine, minRating, maxPrice } = req.query;

    let filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (cuisine) filter.cuisine = { $regex: cuisine, $options: "i" };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    const restaurants = await Restaurant.find(filter);

    res.json({
      success: true,
      total: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
}

// GET SINGLE RESTAURANT
async function getRestaurantById(req, res) {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
}

// UPDATE RESTAURANT (ADMIN ONLY)
async function updateRestaurant(req, res) {
  try {
    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      message: "Restaurant updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message,
    });
  }
}

// DELETE RESTAURANT (ADMIN ONLY)
async function deleteRestaurant(req, res) {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      message: "Restaurant deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete failed",
      error: err.message,
    });
  }
}

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
