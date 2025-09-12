const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const cartRoutes = require("./routes/cart");

require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8000', 'http://localhost:3000', 'https://e-commerce-app-six-beryl.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

// MongoDB connection
mongoose.connect(process.env.MONGODB_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas."));

// Routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something broke!'
  });
});

if(require.main === module){
    app.listen(process.env.PORT || 3000 || 8000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 || 8000}`)
    });
}

module.exports = { app, mongoose };

