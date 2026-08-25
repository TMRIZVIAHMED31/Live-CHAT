require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

connectDB();

const app = express();
app.use(helmet());          // sets safe HTTP headers
app.use(compression());     // gzips responses
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));   // request logging in dev only
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Codveda Level 2 API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
