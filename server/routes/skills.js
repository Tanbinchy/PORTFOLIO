const express  = require('express');
const router   = express.Router();
const Skill    = require('../models/SkillCategory');
const auth     = require('../middleware/auth');

// GET /api/skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
    res.json(skills);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/skills/:id
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json(skill);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/skills  (protected)
router.post('/', auth, async (req, res) => {
  try {
    const skill = new Skill(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/skills/:id  (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ message: 'Not found' });
    res.json(skill);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/skills/:id  (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/skills/seed  (protected)
router.post('/seed', auth, async (req, res) => {
  try {
    await Skill.deleteMany({});
    const seed = [
      {
        title: 'Frontend', emoji: '🎨', colorTheme: 'indigo', order: 1,
        skills: [
          { name: 'React / Next.js',  level: 95, badge: 'Expert'    },
          { name: 'TypeScript',       level: 88, badge: 'Advanced'  },
          { name: 'Tailwind CSS',     level: 93, badge: 'Expert'    },
          { name: 'HTML / CSS',       level: 98, badge: 'Expert'    },
          { name: 'Vue.js',           level: 70, badge: 'Proficient'},
        ],
      },
      {
        title: 'Backend', emoji: '⚙️', colorTheme: 'violet', order: 2,
        skills: [
          { name: 'Node.js / Express',level: 92, badge: 'Expert'    },
          { name: 'Python / Django',  level: 75, badge: 'Advanced'  },
          { name: 'REST APIs',        level: 96, badge: 'Expert'    },
          { name: 'GraphQL',          level: 78, badge: 'Advanced'  },
          { name: 'Microservices',    level: 72, badge: 'Proficient'},
        ],
      },
      {
        title: 'Database', emoji: '🗄️', colorTheme: 'cyan', order: 3,
        skills: [
          { name: 'MongoDB',          level: 92, badge: 'Expert'    },
          { name: 'PostgreSQL',       level: 85, badge: 'Advanced'  },
          { name: 'Redis',            level: 78, badge: 'Advanced'  },
          { name: 'Firebase',         level: 80, badge: 'Advanced'  },
          { name: 'MySQL',            level: 82, badge: 'Advanced'  },
        ],
      },
      {
        title: 'Tools & DevOps', emoji: '🛠️', colorTheme: 'emerald', order: 4,
        skills: [
          { name: 'Git / GitHub',     level: 96, badge: 'Expert'    },
          { name: 'Docker',           level: 80, badge: 'Advanced'  },
          { name: 'AWS / Cloud',      level: 75, badge: 'Advanced'  },
          { name: 'Figma',            level: 85, badge: 'Advanced'  },
          { name: 'CI/CD Pipelines',  level: 73, badge: 'Proficient'},
        ],
      },
    ];
    const docs = await Skill.insertMany(seed);
    res.json({ message: `${docs.length} skill categories seeded`, data: docs });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
