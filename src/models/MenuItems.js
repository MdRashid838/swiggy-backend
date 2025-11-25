const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Starter",
        "Main Course",
        "Dessert",
        "Drinks",
        "Snacks",
        "Breakfast",
        "Biryani",
        "Pizza",
        "Burger",
        "Other",
      ],
      default: "Other",
    },

    price: {
      type: Number,
      required: true,
      min: 1,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 80,
    },

    image: {
      type: [String],
      default: [], // NOT required → optional
    },
    deliveryTime: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },

    deliveryCharges: {
      type: Number,
      default: 30,
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
