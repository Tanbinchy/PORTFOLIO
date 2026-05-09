const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Ashiful Hoque Chowdhury Tanbin" },
    tagline: {
      type: String,
      default: "Passionate developer building the future of the web",
    },
    bio1: { type: String, default: "" },
    bio2: { type: String, default: "" },
    location: {
      type: String,
      default: "North Kattali, Chattogram, Bangladesh",
    },
    email: { type: String, default: "tanbinchy@gmail.com" },
    available: { type: Boolean, default: true },
    profileImage: { type: String, default: "" },
    resumeUrl: { type: String, default: "/resume.pdf" },
    githubUrl: { type: String, default: "https://github.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
    twitterUrl: { type: String, default: "https://twitter.com" },
    techBadges: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("About", aboutSchema);
