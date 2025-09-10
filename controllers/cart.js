const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { errorHandler } = require("../auth");

// module.exports.getCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const cart = await Cart.findOne({ userId }); // no populate()

//     if (!cart) {
//       return res.status(404).json({ success: false, message: 'No cart found for this user.' });
//     }
//     return res.status(200).json({ cart });
//   } catch (err) {
//     console.error('Error fetching cart:', err);
//     return res.status(500).json({ success: false, message: 'Failed to retrieve cart.', error: err.message });
//   }
// };

module.exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }); // no populate()

        if (!cart) {
            return res.status(200).send({ cart: [] });
        }
        return res.status(200).send({ cart });
    } catch (err) {
        console.error("Error fetching cart:", err);
        return res.status(500).send({
            success: false,
            message: "Failed to retrieve cart.",
            error: err.message,
        });
    }
};

// module.exports.addToCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId, quantity } = req.body;

//     // Validate inputs
//     if (!productId || typeof quantity !== 'number' || quantity < 1) {
//       return res.status(400).json({ message: 'Invalid cart item data.' });
//     }

//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }

//     // Calculate subtotal
//     const subtotal = product.price * quantity;

//     // Get or create cart
//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       cart = new Cart({
//         userId,
//         cartItems: [{ productId, quantity, subtotal }]
//       });
//     } else {
//       const itemIndex = cart.cartItems.findIndex(item =>
//         item.productId.equals(productId)
//       );

//       if (itemIndex > -1) {
//         // Update existing item
//         cart.cartItems[itemIndex].quantity = quantity;
//         cart.cartItems[itemIndex].subtotal = subtotal;
//       } else {
//         // Add new item
//         cart.cartItems.push({ productId, quantity, subtotal });
//       }
//     }

//     // Recalculate total price
//     cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

//     // Save and return
//     const savedCart = await cart.save();
//     return res.status(200).json({
//       message: 'Item added to cart successfully',
//       cart: savedCart
//     });

//   } catch (err) {
//     console.error('Error in addToCart:', err);
//     return res.status(500).json({
//       message: 'Failed to update cart.',
//       error: err.message
//     });
//   }
// };

module.exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // Validate inputs
        if (!productId || typeof quantity !== "number" || quantity < 1) {
            return res.status(400).send({ message: "Invalid cart item data." });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found." });
        }

        // Calculate subtotal
        const subtotal = product.price * quantity;

        // Get or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                cartItems: [{ productId, quantity, subtotal }],
            });
        } else {
            const itemIndex = cart.cartItems.findIndex((item) =>
                item.productId.equals(productId)
            );

            if (itemIndex > -1) {
                // Update existing item
                cart.cartItems[itemIndex].quantity = quantity;
                cart.cartItems[itemIndex].subtotal = subtotal;
            } else {
                // Add new item
                cart.cartItems.push({ productId, quantity, subtotal });
            }
        }

        // Recalculate total price
        cart.totalPrice = cart.cartItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        // Save and return
        const savedCart = await cart.save();
        return res.status(200).send({
            message: "Item added to cart successfully",
            cart: savedCart,
        });
    } catch (err) {
        console.error("Error in addToCart:", err);
        return res.status(500).send({
            message: "Failed to update cart.",
            error: err.message,
        });
    }
};

// module.exports.updateCartQuantity = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId, quantity } = req.body;

//     // Input validation
//     if (!productId || typeof quantity !== 'number' || quantity < 1) {
//       return res.status(400).json({ message: 'Invalid cart item data.' });
//     }

//     // Find user's cart
//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found.' });
//     }

//     // Locate the item in cart
//     const idx = cart.cartItems.findIndex(item =>
//       item.productId.equals(productId)
//     );
//     if (idx === -1) {
//       return res.status(404).json({ message: 'Item not found in cart.' });
//     }

//     // Validate product existence & calculate new subtotal
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found.' });
//     }
//     const newSubtotal = product.price * quantity;

//     cart.cartItems[idx].quantity = quantity;
//     cart.cartItems[idx].subtotal = newSubtotal;

//     // Recalculate totalPrice
//     cart.totalPrice = cart.cartItems.reduce((sum, it) => sum + it.subtotal, 0);

//     // Save
//     const savedCart = await cart.save();

//     // Format response
//     const { _id, userId: uid, cartItems, totalPrice, orderedOn, __v } = savedCart;
//     return res.status(200).json({
//       message: 'Item quantity updated successfully',
//       updatedCart: {
//         _id: _id.toString(),
//         userId: uid.toString(),
//         cartItems: cartItems.map(item => ({
//           productId: item.productId.toString(),
//           quantity: item.quantity,
//           subtotal: item.subtotal,
//           _id: item._id.toString()
//         })),
//         totalPrice,
//         orderedOn,
//         v: __v
//       }
//     });
//   } catch (err) {
//     console.error('Error in updateCartQuantity:', err);
//     return res.status(500).json({
//       message: 'Failed to update cart item.',
//       error: err.message
//     });
//   }
// };

module.exports.updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, newQuantity } = req.body;

        // Input validation
        if (!productId || typeof newQuantity !== "number" || newQuantity < 1) {
            return res.status(400).send({ message: "Invalid cart item data." });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).send({ message: "Cart not found." });
        }

        // Locate the item in cart
        const idx = cart.cartItems.findIndex((item) =>
            item.productId.equals(productId)
        );
        if (idx === -1) {
            return res.status(404).send({ message: "Item not found in cart." });
        }

        // Validate product existence & calculate new subtotal
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found." });
        }
        const newSubtotal = product.price * newQuantity;

        cart.cartItems[idx].quantity = newQuantity;
        cart.cartItems[idx].subtotal = newSubtotal;

        // Recalculate totalPrice
        cart.totalPrice = cart.cartItems.reduce(
            (sum, it) => sum + it.subtotal,
            0
        );

        // Save
        const savedCart = await cart.save();

        // Format response
        const {
            _id,
            userId: uid,
            cartItems,
            totalPrice,
            orderedOn,
            __v,
        } = savedCart;
        return res.status(200).send({
            message: "Item quantity updated successfully",
            updatedCart: {
                _id: _id.toString(),
                userId: uid.toString(),
                cartItems: cartItems.map((item) => ({
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    _id: item._id.toString(),
                })),
                totalPrice,
                orderedOn,
                v: __v,
            },
        });
    } catch (err) {
        console.error("Error in updateCartQuantity:", err);
        return res.status(500).send({
            message: "Failed to update cart item.",
            error: err.message,
        });
    }
};

// (s54) ===========================================================

// - pesino

// module.exports.removeItemFromCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { productId } = req.params;

//     // Step 2: Validate productId
//     if (!productId) {
//       return res.status(400).send({ message: "Product ID is required" });
//     }

//     // Step 3: Find cart by userId
//     const cart = await Cart.findOne({ userId });

//     // Step 4: No cart found
//     if (!cart) {
//       return res.status(404).send({ message: "Item not found in cart" });
//     }

//     // Step 5: Check if item exists in cart
//     const index = cart.cartItems.findIndex(item =>
//       item.productId.equals(productId)
//     );

//     if (index === -1) {
//       return res.status(404).send({ message: "Item not found in cart" });
//     }

//     // Step 5a: Remove item and update total price
//     cart.cartItems.splice(index, 1);
//     cart.totalPrice = cart.cartItems.reduce((sum, it) => sum + it.subtotal, 0);

//     // Step 6: Save and respond
//     const updatedCart = await cart.save();
//     return res.status(200).send({
//       message: "Item removed from cart successfully",
//       updatedCart
//     });

//   } catch (err) {
//     console.error("Error in removeItemFromCart:", err);
//     res.status(500).send({ message: "Failed to remove item from cart", error: err.message });
//   }
// };

// module.exports.clearCart = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Step 3: Find cart by userId
//     const cart = await Cart.findOne({ userId });

//     // Step 4: No cart found
//     if (!cart) {
//       return res.status(404).send({ message: "Cart not found" });
//     }

//     // Step 5: Check if cart has items
//     if (cart.cartItems.length === 0) {
//       return res.status(400).send({ message: "Cart is already empty" });
//     }

//     // Step 5a: Clear items and reset total
//     cart.cartItems = [];
//     cart.totalPrice = 0;

//     // Step 6: Save and respond
//     const clearedCart = await cart.save();

//     return res.status(200).send({
//       message: "Cart cleared successfully",
//       cart: {
//         id: clearedCart._id.toString(),
//         userId: clearedCart.userId.toString(),
//         cartItems: [],
//         totalPrice: 0,
//         orderedOn: clearedCart.orderedOn,
//         __v: clearedCart.__v
//       }
//     });
//   } catch (err) {
//     console.error("Error in clearCart:", err);
//     res.status(500).send({ message: "Failed to clear cart", error: err.message });
//   }
// };

// - nulud

module.exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        // Input validation
        if (!productId) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // Check if the item exists in cartItems
        const itemIndex = cart.cartItems.findIndex((item) =>
            item.productId.equals(productId)
        );
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // 4a. Remove item & recalc totalPrice
        cart.cartItems.splice(itemIndex, 1);
        cart.totalPrice = cart.cartItems.reduce(
            (sum, it) => sum + it.subtotal,
            0
        );

        // Save updated cart
        const savedCart = await cart.save();

        // Format response
        const {
            _id,
            userId: uid,
            cartItems,
            totalPrice,
            orderedOn,
            __v,
        } = savedCart;
        return res.status(200).json({
            message: "Item removed from cart successfully",
            updatedCart: {
                _id: _id.toString(),
                userId: uid.toString(),
                cartItems: cartItems.map((item) => ({
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    _id: item._id.toString(),
                })),
                totalPrice,
                orderedOn,
                v: __v,
            },
        });
    } catch (err) {
        console.error("Error in removeItemFromCart:", err);
        return res.status(500).json({
            message: "Failed to remove item from cart.",
            error: err.message,
        });
    }
};

module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // 2. Find the user's cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }

        // 4a. Check if cartItems has at least one item
        if (cart.cartItems.length === 0) {
            return res.status(400).json({ message: "Cart is already empty." });
        }

        // 4b. Clear all items and reset totalPrice
        cart.cartItems = [];
        cart.totalPrice = 0;

        // 5. Save updated cart
        const savedCart = await cart.save();

        // Format response
        const {
            _id,
            userId: uid,
            cartItems,
            totalPrice,
            orderedOn,
            __v,
        } = savedCart;
        return res.status(200).json({
            message: "Cart cleared successfully",
            cart: {
                _id: _id.toString(),
                userId: uid.toString(),
                cartItems: cartItems.map((item) => ({
                    productId: item.productId.toString(),
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    _id: item._id.toString(),
                })),
                totalPrice,
                orderedOn,
                v: __v,
            },
        });
    } catch (err) {
        console.error("Error in clearCart:", err);
        return res.status(500).json({
            message: "Failed to clear cart.",
            error: err.message,
        });
    }
};
