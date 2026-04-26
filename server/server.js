const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://portfolio-jet-five-c0i1x44biz.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/about", require("./routes/about"));
app.use("/api/skills", require("./routes/skills"));
app.use("/api/services", require("./routes/services"));
app.use("/api/testimonials", require("./routes/testimonials"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Portfolio API is running 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅  Connected to MongoDB Atlas");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
      console.log(`📋  Admin login → POST /api/auth/login`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection error:", err.message);
    process.exit(1);
  });
