const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const workerRoutes = require("./routes/workerRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const chatRoutes = require("./routes/chatRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(
  cors({
origin: [
  process.env.CLIENT_URL,
  "https://rentona-crm-gules.vercel.app",
  "https://rentona-crm-git-main-avikshit-s-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Rentona API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;