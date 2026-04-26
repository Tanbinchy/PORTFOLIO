const express = require('express');
const router  = express.Router();
const Stat    = require('../models/Stat');
const auth    = require('../middleware/auth');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1, createdAt: 1 });
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/stats  (protected)
router.post('/', auth, async (req, res) => {
  try {
    const stat = new Stat(req.body);
    await stat.save();
    res.status(201).json(stat);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/stats/:id  (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const stat = await Stat.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!stat) return res.status(404).json({ message: 'Not found' });
    res.json(stat);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/stats/:id  (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Stat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/stats/seed  (protected)
router.post('/seed', auth, async (req, res) => {
  try {
    await Stat.deleteMany({});
    const seed = [
      { value: '50+', label: 'Projects Done',  order: 1 },
      { value: '30+', label: 'Happy Clients',  order: 2 },
      { value: '3+',  label: 'Years Exp.',     order: 3 },
      { value: '99%', label: 'Satisfaction',   order: 4 },
    ];
    const docs = await Stat.insertMany(seed);
    res.json({ message: `${docs.length} stats seeded`, data: docs });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
