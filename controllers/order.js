const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart"); //============================================================================== s55nulud
const { errorHandler } = require("../auth");

//=========================================================================================================== s55nulud
module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found." });
        }

        // Ensure cart has items
        if (!cart.cartItems.length) {
            return res.status(400).send({ message: "No Items to Checkout" });
        }

        // Build order data
        const newOrder = new Order({
            userId,
            productsOrdered: cart.cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                subtotal: item.subtotal,
            })),
            totalPrice: cart.totalPrice,
        });

        // Save the order
        const savedOrder = await newOrder.save();

        res.status(201).send({
            message: "Order created successfully",
            order: savedOrder,
        });
    } catch (err) {
        console.error("Error in createOrder:", err);
        res.status(500).send({
            message: "Failed to create order.",
            error: err.message,
        });
    }
};

module.exports.myOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId });

        if (!orders || orders.length === 0) {
            return res.status(200).send({ orders: [] });
        }

        res.status(200).send({ orders });
    } catch (err) {
        console.error("Error in myOrders:", err);
        res.status(500).send({
            message: "Failed to retrieve orders.",
            error: err.message,
        });
    }
};

module.exports.allOrders = async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find();

        // Send orders to the client
        return res.status(200).send({ orders });
    } catch (err) {
        console.error("Error in allOrders:", err);
        // On error, respond with message and details
        return res.status(500).send({
            message: "Failed to retrieve orders.",
            error: err.message,
        });
    }
};

//=========================================================================================================== s55nulud
module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                message: "Order ID and status are required",
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("productsOrdered.productId", "name price images");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

module.exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate(
            "productsOrdered.productId",
            "name price images"
        );

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};
