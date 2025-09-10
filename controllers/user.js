const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const { errorHandler } = require("../auth");

// Register user
module.exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNo } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const validMobilePattern = /^(09\d{9}|\+639\d{9})$/;

    if (!mobileNo || !validMobilePattern.test(mobileNo)) {
      return res.status(400).json({ error: "Invalid mobile number. Use 09XXXXXXXXX or +639XXXXXXXXX." });
    }


    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNo
    });

    await newUser.save();

    return res.status(201).json({ success: true, message: "Registered Successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Update profile
module.exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, mobileNo, addresses } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo, addresses },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Reset password
module.exports.resetPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;

    // Only check for newPassword
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Directly set new password (no comparison)
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password successfully updated." });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Update user to admin
module.exports.updateUserAsAdmin = async (req, res) => {
  try {
    const userId = req.params.id; // Use route param (from router)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated as admin successfully",
      user: updatedUser
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Get user's orders
module.exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate("items.productId", "name price images");

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// Check email existence
module.exports.checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    res.status(200).json({ exists: !!user });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// User login
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const access = auth.createAccessToken(user);

    // Return only the token
    return res.status(200).json({ access });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    errorHandler(error, req, res);
  }
};