const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    icon:        { type: String, default: '⚡' },
    featured:    { type: Boolean, default: false },
    tags:        [{ type: String, trim: true }],
    colorTheme: {
      type: String,
      enum: ['indigo', 'violet', 'cyan', 'pink', 'emerald', 'orange', 'rose', 'amber'],
      default: 'indigo',
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
