const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true, trim: true },
    description:     { type: String, required: true },
    longDescription: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Web App', 'Mobile', 'API', 'UI/UX', 'Other'],
    },
    technologies: [{ type: String, trim: true }],
    imageUrl:   { type: String, default: '' },
    liveUrl:    { type: String, default: '' },
    githubUrl:  { type: String, default: '' },
    featured:   { type: Boolean, default: false },
    metrics: {
      stars: { type: Number, default: 0 },
      forks: { type: Number, default: 0 },
      views: { type: String, default: '0' },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
