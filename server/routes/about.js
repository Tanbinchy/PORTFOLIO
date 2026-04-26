const express = require("express");
const router = express.Router();
const About = require("../models/About");
const auth = require("../middleware/auth");

// GET /api/about
router.get("/", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // Return defaults if not seeded yet
      about = new About();
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/about  (protected — upsert)
router.put("/", auth, async (req, res) => {
  try {
    let about = await About.findOne();
    if (about) {
      Object.assign(about, req.body);
      await about.save();
    } else {
      about = new About(req.body);
      await about.save();
    }
    res.json(about);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/about/seed  (protected)
router.post("/seed", auth, async (req, res) => {
  try {
    await About.deleteMany({});
    const about = new About({
      name: "Alex Johnson",
      tagline: "Passionate developer building the future of the web",
      bio1: "I'm a Full Stack Developer with over 3 years of experience designing and building web applications that are fast, scalable, and delightful to use. I specialize in the JavaScript ecosystem — from pixel-perfect React UIs to robust Node.js backends.",
      bio2: "When I'm not coding, I'm contributing to open-source projects, writing technical articles, and exploring the latest in web performance and design systems. I believe great software is equal parts engineering and empathy.",
      location: "San Francisco, CA",
      email: "hello@alexjohnson.dev",
      available: true,
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=85",
      resumeUrl:
        "https://drive.google.com/file/d/17uQCOI3aJBYABkUZKJDnWaGYs4C_21rJ/view?usp=sharing",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
      techBadges: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Tailwind CSS",
        "Docker",
        "AWS",
        "GraphQL",
        "Redis",
        "React Native",
        "Figma",
        "Git",
      ],
    });
    await about.save();
    res.json({ message: "About seeded", data: about });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
