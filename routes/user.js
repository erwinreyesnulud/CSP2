const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// ----------------------------
// Public routes (no auth required)
// ----------------------------

router.post("/checkEmail", userController.checkEmailExists);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);


// ----------------------------
// Authenticated user routes (token required)
// ----------------------------

router.get("/details", verify, userController.getProfile);
router.patch("/profile", verify, userController.updateProfile);
router.patch("/update-password", verify, userController.resetPassword);
router.get("/orders", verify, userController.getUserOrders);

// ----------------------------
// Admin-only routes (token + admin required)
// ----------------------------

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

module.exports = router;