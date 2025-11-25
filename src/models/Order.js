const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    // user: {
    //     id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    //     // name: String,
    //     // email: String
    // },

    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
            // name: String,
            quantity: { type: Number, required: true, min: 1 },
            price: Number
        }
    ],

    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    // 🔥 Order status list (real-life)
    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "preparing",
            "on-the-way",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    // 🟢 Payment Status (new)
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },

    // 🟢 Payment Method (new)
    paymentMethod: {
        type: String,
        enum: ["COD", "ONLINE"],
        default: "COD"
    },

    // 🟢 Delivery address
    deliveryAddress: {
        type: String,
        required:false
    }

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
