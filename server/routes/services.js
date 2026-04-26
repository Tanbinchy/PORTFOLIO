const express  = require('express');
const router   = express.Router();
const Service  = require('../models/Service');
const auth     = require('../middleware/auth');

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ featured: -1, order: 1, createdAt: 1 });
    res.json(services);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const svc = await Service.findById(req.params.id);
    if (!svc) return res.status(404).json({ message: 'Not found' });
    res.json(svc);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/services  (protected)
router.post('/', auth, async (req, res) => {
  try {
    const svc = new Service(req.body);
    await svc.save();
    res.status(201).json(svc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/services/:id  (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const svc = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!svc) return res.status(404).json({ message: 'Not found' });
    res.json(svc);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/services/:id  (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/services/seed  (protected)
router.post('/seed', auth, async (req, res) => {
  try {
    await Service.deleteMany({});
    const seed = [
      {
        title: 'Full Stack Web Development',
        description: 'End-to-end web application development using modern frameworks like React, Next.js, and Node.js. From clean architecture and API design to pixel-perfect UI — I handle it all, delivered on time.',
        icon: '🌐', featured: true, colorTheme: 'indigo', order: 1,
        tags: ['React', 'Node.js', 'MongoDB', 'Next.js', 'TypeScript'],
      },
      { title: 'API & Backend Development',  description: 'Robust RESTful & GraphQL APIs with JWT auth, rate limiting, Redis caching and Swagger docs.', icon: '⚡', colorTheme: 'violet',  order: 2, tags: [] },
      { title: 'Mobile App Development',     description: 'Cross-platform React Native apps with native-like performance for iOS & Android.',           icon: '📱', colorTheme: 'cyan',    order: 3, tags: [] },
      { title: 'UI/UX Design',               description: 'Beautiful, intuitive interfaces with pixel-perfect implementation and modern design systems.',  icon: '🎨', colorTheme: 'pink',    order: 4, tags: [] },
      { title: 'Database Architecture',      description: 'Schema design, query optimization, and scalable database solutions for high-load applications.',icon: '🗄️', colorTheme: 'emerald', order: 5, tags: [] },
      { title: 'Performance Optimization',   description: 'Lighthouse audits, caching strategies, lazy loading, and code-splitting for blazing-fast apps.',icon: '🚀', colorTheme: 'orange',  order: 6, tags: [] },
    ];
    const docs = await Service.insertMany(seed);
    res.json({ message: `${docs.length} services seeded`, data: docs });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
