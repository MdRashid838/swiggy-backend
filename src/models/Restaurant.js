const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },


    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5
    },

    ratingCount: {
      type: Number,
      default: 0
    },

    images: {
      type: [String], // multiple images
      default: []
    },

    location: {
      address: { type: String },
      lat: { type: Number },
      lng: { type: Number }
    },

    isOpen: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// IMPORTANT INDEXES (FAST SEARCHING)
RestaurantSchema.index({ name: "text", cuisines: "text" });

module.exports = mongoose.model("Restaurant", RestaurantSchema);
