const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const auth = require("../middleware/auth");

// GET /api/testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      order: 1,
      createdAt: 1,
    });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/testimonials/:id
router.get("/:id", async (req, res) => {
  try {
    const t = await Testimonial.findById(req.params.id);
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/testimonials  (protected)
router.post("/", auth, async (req, res) => {
  try {
    const t = new Testimonial(req.body);
    await t.save();
    res.status(201).json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/testimonials/:id  (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!t) return res.status(404).json({ message: "Not found" });
    res.json(t);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/testimonials/:id  (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/testimonials/seed  (protected)
router.post("/seed", auth, async (req, res) => {
  try {
    await Testimonial.deleteMany({});
    const seed = [
      {
        name: "Sarah Johnson",
        role: "CTO",
        company: "TechCorp Inc.",
        image:
          "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=200&q=80",
        rating: 5,
        order: 1,
        review:
          "Alex delivered an exceptional e-commerce platform that exceeded all our expectations. The code quality was outstanding, and the UI was absolutely stunning. Performance improvements alone boosted our conversion by 40%. Will definitely work together again!",
        metrics: [
          { label: "Timeline", value: "On Time" },
          { label: "Quality", value: "10/10" },
          { label: "Communication", value: "Excellent" },
        ],
      },
      {
        name: "Michael Chen",
        role: "Founder & CEO",
        company: "StartupXYZ",
        image:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        rating: 5,
        order: 2,
        review:
          "Working with Alex was a game-changer for our startup. He built our entire MVP from scratch in just 6 weeks with incredible attention to detail. His performance optimizations saved us thousands in monthly server costs. Highly recommended!",
        metrics: [
          { label: "Delivered", value: "2 Weeks Early" },
          { label: "Quality", value: "9.5/10" },
          { label: "Communication", value: "Top Notch" },
        ],
      },
      {
        name: "Emily Williams",
        role: "Product Manager",
        company: "DigitalAgency",
        image:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        rating: 5,
        order: 3,
        review:
          "The portfolio website Alex built completely transformed our online presence. Beautiful design, lightning fast, and perfectly responsive across all devices. Our client inquiries literally doubled within the first month of launch!",
        metrics: [
          { label: "Timeline", value: "On Schedule" },
          { label: "Quality", value: "10/10" },
          { label: "Result", value: "2× Inquiries" },
        ],
      },
      {
        name: "David Martinez",
        role: "Director of Engineering",
        company: "GlobalTech",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        rating: 5,
        order: 4,
        review:
          "Alex seamlessly integrated our complex legacy systems with a modern React frontend. His technical expertise and creative problem-solving ability are second to none. He tackled challenges that two previous developers had failed to solve.",
        metrics: [
          { label: "Delivered", value: "Ahead of Plan" },
          { label: "Quality", value: "9.8/10" },
          { label: "Communication", value: "Exceptional" },
        ],
      },
    ];
    const docs = await Testimonial.insertMany(seed);
    res.json({ message: `${docs.length} testimonials seeded`, data: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
