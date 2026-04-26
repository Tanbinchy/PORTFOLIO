const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema(
  { label: String, value: String },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    role:    { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    image:   { type: String, default: '' },
    rating:  { type: Number, default: 5, min: 1, max: 5 },
    review:  { type: String, required: true },
    metrics: [metricSchema],
    order:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
