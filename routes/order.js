const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const auth = require("../auth");
const { verify, verifyAdmin } = auth;

// User routes
// router.post("/", verify, orderController.createOrder);
// router.get("/user", verify, orderController.getUserOrders);

// ================================================================== s55nulud
router.post("/checkout", verify, orderController.createOrder);
router.get("/my-orders", verify, orderController.myOrders);
// ================================================================== s55nulud


// Admin routes
router.patch("/status", verify, verifyAdmin, orderController.updateOrderStatus);

// ================================================================== s55nulud
router.get("/all-orders", verify, verifyAdmin, orderController.allOrders);
// ================================================================== s55nulud

module.exports = router;