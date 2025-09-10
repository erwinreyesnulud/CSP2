const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, "Product ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"]
  },
  subtotal: {
    type: Number,
    required: [true, "Subtotal is required"]
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"],
    unique: true // Each user should have only one cart
  },
  cartItems: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
    default: 0 // Default to 0 when cart is empty
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Cart", cartSchema);