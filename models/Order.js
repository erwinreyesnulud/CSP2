const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
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

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "User ID is required"],
  },
  productsOrdered: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  },
});

module.exports = mongoose.model("Order", orderSchema);