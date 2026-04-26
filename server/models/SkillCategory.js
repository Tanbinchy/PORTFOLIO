const mongoose = require('mongoose');

const skillItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  badge: { type: String, enum: ['Beginner', 'Proficient', 'Advanced', 'Expert'], default: 'Proficient' },
}, { _id: false });

const skillCategorySchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    emoji:      { type: String, default: '⚡' },
    colorTheme: {
      type: String,
      enum: ['indigo', 'violet', 'cyan', 'emerald', 'pink', 'orange', 'rose', 'amber'],
      default: 'indigo',
    },
    skills: [skillItemSchema],
    order:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
