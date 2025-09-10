const Product = require("../models/Product");
const { errorHandler } = require("../auth");

// Create Product (Admin only)
module.exports.addProduct = async (req, res) => {
    try {
        const existingProduct = await Product.findOne({ name: req.body.name });
        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Product already exists",
            });
        }

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: savedProduct,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Get All Products (Admin only)
module.exports.getAllProductsAdmin = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Get All Active Products (Public)
module.exports.getAllActive = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).send(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: "Server error" });
    }
};

// Get Single Product (Public)
module.exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.status(200).send(product);
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Search by name
module.exports.searchByName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res
                .status(400)
                .json({ success: false, message: "Name is required" });
        }

        const results = await Product.find({
            isActive: true,
            name: { $regex: name, $options: "i" },
        });

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found matching the name",
                products: [],
            });
        }

        res.status(200).json(results);
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Search by price range
module.exports.searchByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        if (!minPrice && !maxPrice) {
            return res.status(400).json({
                success: false,
                message: "At least one of minPrice or maxPrice is required",
            });
        }

        let priceQuery = {};
        if (minPrice) priceQuery.$gte = parseFloat(minPrice);
        if (maxPrice) priceQuery.$lte = parseFloat(maxPrice);

        const results = await Product.find({
            isActive: true,
            price: priceQuery,
        });

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found in this price range",
                products: [],
            });
        }

        res.status(200).json(results);
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Update Product (Admin only)
module.exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Archive Product (Admin only)
module.exports.archiveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        if (!product.isActive) {
            return res.status(200).json({
                message: "Product already archived",
                archivedProduct: product,
            });
        }

        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: "true",
            message: "Product archived successfully",
            archivedProduct: product,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

// Activate Product (Admin only)
module.exports.activateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).send({
                message: "Product not found",
            });
        }

        if (product.isActive) {
            return res.status(200).send({
                message: "Product already active",
                activateProduct: product,
            });
        }

        product.isActive = true;
        await product.save();

        return res.status(200).send({
            success: true,
            message: "Product activated successfully",
        });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.productId
        );

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        return res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
};
