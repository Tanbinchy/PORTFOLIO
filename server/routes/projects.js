const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/auth");

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/projects  (optionally ?category=Web App)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const projects = await Project.find(filter).sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ─── Protected Routes ─────────────────────────────────────────────────────────

// POST /api/projects  (create)
router.post("/", auth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PUT /api/projects/:id  (update)
router.put("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/projects/seed/sample  — seed demo data (protected)
router.post("/seed/sample", auth, async (req, res) => {
  try {
    await Project.deleteMany({});

    const sampleProjects = [
      {
        title: "Quiz App",
        description:
          "An interactive quiz web application that allows users to answer MCQs, track scores, and test knowledge in a responsive UI.",
        longDescription:
          "A responsive quiz application designed to provide an engaging learning experience through multiple-choice questions. Users can select answers, navigate through questions, and receive a final score based on their performance. The app dynamically renders questions, tracks user responses, and calculates results instantly. It is built with a clean UI and optimized for smooth performance across devices. The system demonstrates core frontend concepts such as state management, dynamic rendering, and user interaction handling.",
        category: "Web App",
        technologies: ["HTML", "CSS", "JavaScript"],
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1680303134459-912abf8efe2f?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://quiz-app-teal-zeta.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Quiz_App.git",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Employee Management System",
        description:
          "A responsive role-based employee task management app with admin and employee dashboards using local Storage.",
        longDescription:
          "A React + Vite web app that simulates an employee task system with role-based authentication. Admins can assign and monitor tasks, while employees can accept, update, and manage task statuses (New, Active, Completed, Failed). Data is stored in local Storage, with state handled via React Context.",
        category: "Web App",
        technologies: [
          "React",
          "Vite",
          "Tailwind CSS",
          "ESLint",
          "React Context API",
          "localStorage",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1721829502786-982bcedd20d8?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://employee-management-system-two-blue.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Employee_Management_System",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Pokémon Explorer",
        description:
          "A React-based Pokémon explorer app to browse, search, and view detailed Pokémon data using API integration.",
        longDescription:
          "Pokémon Explorer is a modern web application built with React and Vite that allows users to explore Pokémon data interactively. The app fetches data from the PokéAPI and displays Pokémon in a clean, responsive UI. Users can search Pokémon by name, filter results, and view detailed information such as types, abilities, and stats.\n\nThe system uses dynamic rendering, client-side routing, and efficient state management to provide a smooth user experience. Features like pagination, filtering, and real-time search make it scalable for handling large datasets of Pokémon. Such explorer systems typically manage data fetching, filtering, pagination, and UI rendering dynamically for hundreds of Pokémon.",
        category: "Web App",
        technologies: [
          "React",
          "Vite",
          "Tailwind CSS",
          "React Router",
          "JavaScript (ES6+)",
          "REST API",
          "JSON Server",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1759919440171-cdbc6b2f3554?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://pokemon-explorer-six-theta.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Pokemon_Explorer",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "To Do App",
        description:
          "A simple and interactive to-do list app with task management and local storage support.",
        longDescription:
          "This To Do App is a lightweight task management web application built using HTML, CSS, and JavaScript. It allows users to add, mark, and delete tasks efficiently. The app uses browser localStorage to persist data, ensuring tasks remain saved even after page reloads.\n\nUsers can mark tasks as completed with a visual strike-through effect and remove tasks instantly. The clean UI, responsive layout, and real-time updates provide a smooth user experience. This project demonstrates DOM manipulation, event handling, and client-side data storage without any backend.",
        category: "Web App",
        technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
        imageUrl:
          "https://images.unsplash.com/photo-1662027008658-b615840c7deb?q=80&w=862&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://to-do-app-tan-omega.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/To_Do_App",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Tic Tac Toe Game",
        description:
          "A simple interactive Tic Tac Toe game built with HTML, CSS, and JavaScript featuring turn-based gameplay and winner detection.",
        longDescription:
          "Tic Tac Toe Game is a classic two-player web-based game developed using HTML, CSS, and JavaScript. The application provides an interactive 3x3 grid where players take turns marking X and O. The system automatically tracks player turns, detects winning conditions, and displays the winner or draw result.\n\nThe game includes features such as reset functionality, new game restart, and dynamic UI updates without page reload. It uses DOM manipulation and event handling to manage game state efficiently. Such grid-based games typically rely on logical condition checking, event-driven updates, and state management using JavaScript for smooth gameplay.",
        category: "Web App",
        technologies: ["HTML5", "CSS", "JavaScript", "DOM Manipulation"],
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1673735396428-d51dc2a7a62d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://tic-tac-toe-mini.vercel.app/",
        githubUrl: "",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Weather App",
        description:
          "A real-time weather application that fetches and displays live weather data based on user-entered city names.",
        longDescription:
          "Weather App is a responsive web application built using HTML, CSS, and JavaScript that allows users to search for any city and view real-time weather conditions. The app fetches live data from a weather API and displays key information such as temperature, humidity, wind speed, and weather conditions.\n\nIt includes error handling for invalid city names and dynamically updates the UI without page reload. The system demonstrates core concepts of API integration, asynchronous JavaScript (fetch/async handling), and DOM manipulation for real-time data rendering. Such weather systems typically rely on external API communication, conditional rendering, and dynamic UI updates based on user input.",
        category: "Web App",
        technologies: [
          "HTML5",
          "CSS",
          "JavaScript",
          "REST API",
          "DOM Manipulation",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1705077296278-d82dd5c8662f?q=80&w=1109&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://weather-app-phi-ebon-99.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/4_WEATHER_APP",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "BMI Calculator App",
        description:
          "A simple BMI (Body Mass Index) calculator built with React and Vite that computes BMI based on user input and displays health category results.",
        longDescription:
          "BMI Calculator is a React-based web app that calculates Body Mass Index from user input (height and weight). It instantly shows the BMI value and classifies it into health categories like underweight, normal, overweight, or obese. The project demonstrates React state management, real-time updates, and clean UI rendering using Vite for fast performance.",
        category: "Web App",
        technologies: [
          "React",
          "Vite",
          "JavaScript",
          "HTML",
          "CSS",
          "React Hooks",
        ],
        imageUrl:
          "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://1-bmi-calculator.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/1_BMI_Calculator",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Age Calculator App",
        description:
          "A simple age calculator built with React and Vite that calculates exact age from date of birth and displays years, months, and days.",
        longDescription:
          "Age Calculator App is a responsive web application developed using React and Vite that allows users to calculate their exact age by entering their date of birth. The application dynamically computes age and displays results in years, months, and days.",
        category: "Web App",
        technologies: [
          "React",
          "Vite",
          "JavaScript",
          "CSS",
          "HTML",
          "React Hooks",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1676422355760-d7027256faef?q=80&w=746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://age-calculator-tau-lovat.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Age_Calculator",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Interest Calculator App",
        description:
          "A simple interest calculator built with React and Vite that calculates interest amount based on principal, rate, and time input.",
        longDescription:
          "Interest Calculator App is a responsive web application developed using React and Vite that allows users to calculate simple interest by entering principal amount, interest rate, and time duration. The application dynamically computes interest and displays the total amount instantly.",
        category: "Web App",
        technologies: [
          "React",
          "Vite",
          "JavaScript",
          "CSS",
          "HTML",
          "React Hooks",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1681487750511-13075dd4a525?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://interest-calculator-lac-three.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Interest_Calculator",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Movie Recommendation System",
        description:
          "A machine learning-based movie recommendation system built with Python that suggests similar movies based on user selection using similarity algorithms.",
        longDescription:
          "Movie Recommendation System is a Python-based machine learning project that recommends movies based on similarity scores between titles. The system uses precomputed datasets and a similarity matrix to suggest relevant movies when a user selects a specific movie.",
        category: "API",
        technologies: [
          "Python",
          "Machine Learning",
          "Pandas",
          "NumPy",
          "Scikit-learn",
          "Pickle",
          "Flask",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_vector-1722710839634-68ff6eaa7186?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://movies-recommendation-system-python.streamlit.app/",
        githubUrl: "https://github.com/Tanbinchy/MoviesRsPython",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Expense Management System",
        description:
          "A full-stack expense tracking application built with the MERN stack that allows users to manage income and expenses with real-time dashboard visualization.",
        longDescription:
          "Expense Tracker is a full-stack web application developed using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to track their income and expenses, manage financial records, and visualize overall balance through interactive charts and dashboards.\n\nThe backend is built with Node.js and Express, handling REST APIs, database models, and transaction routes. The frontend is developed with React and includes reusable components such as dashboard, charts, forms, and history views. Global state management is handled using React Context API.\n\nThis project demonstrates full-stack development concepts including API design, database modeling, state management, and dynamic UI rendering with data visualization.",
        category: "Web App",
        technologies: [
          "MongoDB",
          "Express.js",
          "React.js",
          "Node.js",
          "JavaScript",
          "CSS3",
          "React Context API",
          "Chart Libraries",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_vector-1745220735369-005538829dc2?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://emsprojectdone.netlify.app/",
        githubUrl: "",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Blog Client",
        description:
          "A modern multi-page blog frontend built with HTML and CSS featuring responsive layouts for blog posts, author pages, contact, privacy, and about sections.",
        longDescription:
          "Blog Client is a frontend web application designed as a multi-page blogging platform UI. It includes multiple structured pages such as blog posts, author profile, contact form, privacy policy, and about page. The project focuses heavily on UI/UX design, layout structuring, and responsive styling using pure CSS.\n\nThe system demonstrates strong frontend development concepts such as reusable design patterns, flexbox-based layouts, typography control, and component-style page structuring without backend dependency. It simulates a real-world blogging platform interface where users can browse articles, view author details, and interact through contact forms.\n\nThis project highlights modern CSS techniques, responsive design principles, and multi-page static website architecture.",
        category: "Web App",
        technologies: [
          "HTML5",
          "CSS3",
          "Google Fonts",
          "Flexbox & Layout Systems",
          "Responsive Design Principles",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_photo-1719930117885-0a0b2c65eb64?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://blognest-six.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Blog-Client",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
      {
        title: "Prize Bond Matcher",
        description:
          "Upload two PDFs and instantly find matching prize bond numbers in your browser.",
        longDescription:
          "Prize Bond Matcher is a fully client-side web application that allows users to compare prize bond numbers from two PDF files.\n\nUsers upload an official winning numbers PDF and their personal bond list PDF. The app extracts numbers directly in the browser, compares them efficiently using a Set-based matching algorithm, and instantly highlights winning matches.\n\nKey features:\n- 100% client-side processing (no server upload)\n- Fast PDF parsing and number extraction\n- Instant matching using optimized JavaScript logic\n- Visual results with matched highlights\n- Downloadable HTML report of results\n\nThis project focuses on privacy, performance, and simplicity while solving a real-world use case for prize bond checking.",
        category: "Web App",
        technologies: [
          "Custom PDF Parser",
          "CSS",
          "HTML",
          "JavaScript",
          "React",
        ],
        imageUrl:
          "https://plus.unsplash.com/premium_vector-1745056449935-e0cb72f497f7?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        liveUrl: "https://prizebond-matcher.vercel.app/",
        githubUrl: "https://github.com/Tanbinchy/Prizebond_Matcher",
        featured: true,
        metrics: {
          stars: 0,
          forks: 0,
          views: "0",
        },
        order: 0,
      },
    ];

    const projects = await Project.insertMany(sampleProjects);
    res.json({
      message: `✅ ${projects.length} sample projects seeded successfully!`,
      count: projects.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Seeding failed", error: err.message });
  }
});

module.exports = router;
