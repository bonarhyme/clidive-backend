const express = require("express");
const app = express();

require("dotenv/config");

const connectDB = require("./config/db");

// Parse JSON
app.use(express.json());

// Connect Database
connectDB();

// Middlewares
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const listingRoutes = require("./routes/listingRoutes");

app.get("/", (req, res) => {
  res.send("Server is active!!!");
});
//User routes
app.use("/api/user", userRoutes);
//Listing routes
app.use("/api/listing", listingRoutes);

//Not found URL middleware
app.use(notFound);

//Error handler for the whole app
app.use(errorHandler);

const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
