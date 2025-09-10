const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");

// ──────────────────────────────────────
// Admin-only Routes
// ──────────────────────────────────────

// Create a new product
// POST http://localhost:4000/products
// Headers: Authorization: Bearer <admin_token>
// Body (JSON): { "name": "Sample", "description": "Desc", "price": 123.45 }
router.post("/", verify, verifyAdmin, productController.addProduct);

// Retrieve all products (admin only)
// GET http://localhost:4000/products/all
// Headers: Authorization: Bearer <admin_token>
router.get("/all", verify, verifyAdmin, productController.getAllProductsAdmin);

// Update product info
// PATCH http://localhost:4000/products/:productId/update
// Headers: Authorization: Bearer <admin_token>
// Body (JSON): { "name": "Updated Name", "description": "Updated Desc", "price": 200 }
router.patch(
    "/:productId/update",
    verify,
    verifyAdmin,
    productController.updateProduct
);

// Archive product
// PATCH http://localhost:4000/products/:productId/archive
// Headers: Authorization: Bearer <admin_token>
router.patch(
    "/:productId/archive",
    verify,
    verifyAdmin,
    productController.archiveProduct
);

// Activate product
// PATCH http://localhost:4000/products/:productId/activate
// Headers: Authorization: Bearer <admin_token>
router.patch(
    "/:productId/activate",
    verify,
    verifyAdmin,
    productController.activateProduct
);

// Delete product
// DELETE http://localhost:4000/products/:productId
router.delete(
    "/:productId",
    verify,
    verifyAdmin,
    productController.deleteProduct
);

// ──────────────────────────────────────
// Public Routes
// ──────────────────────────────────────

// Get all active products
// GET http://localhost:4000/products
router.get("/", productController.getAllActive);

router.post("/search-by-name", productController.searchByName);
router.post("/search-by-price", productController.searchByPrice);

router.get("/active", productController.getAllActive);

// Get a single product by ID
// GET http://localhost:4000/products/:productId
router.get("/:productId", productController.getProduct);

module.exports = router;
