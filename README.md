# 🚀 Alex Johnson — Full Stack Developer Portfolio

A modern, dynamic portfolio website built with **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB Atlas**. Features glassmorphism design, smooth animations, and a full admin dashboard for project management.

---

## 🌟 Features

### Portfolio

- **Animated Navbar** — transparent → glassmorphism on scroll, active section tracking
- **Hero Section** — typing animation, animated gradient border, stats grid, scroll indicator
- **About Section** — bio, tech stack badges, animated stat cards, resume download
- **Skills Section** — 4 categories with animated proficiency bars and color-coded badges
- **Projects** — 🔴 **DYNAMIC from MongoDB** — filters, pagination, hover overlays, metrics
- **Services** — Bento-style grid with large featured card and hover glow effects
- **Testimonials** — Auto-advancing carousel, grayscale→color photos, metric chips
- **Contact Form** — Validation, glassmorphic inputs, saves to MongoDB, success/error alerts
- **Footer** — Multi-column layout, social links, animated heart, back-to-top

### Admin Dashboard (`/admin`)

- 🔐 JWT authentication (email + password via `.env`)
- 📊 Stats overview (total projects, featured, categories, unread messages)
- 📋 Project table with Create / Edit / Delete actions
- 🌱 One-click seed sample data (6 demo projects)
- ✉️ View and manage contact form submissions
- ✅ Mark messages as read / delete

---

## 📁 Project Structure

```
portfolio/
├── package.json          ← root (concurrently)
├── server/
│   ├── .env              ← ⚠️  update before production
│   ├── server.js
│   ├── models/
│   │   ├── Project.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── contact.js
│   └── middleware/
│       └── auth.js
└── client/
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Hero.jsx
        │   ├── About.jsx
        │   ├── Skills.jsx
        │   ├── Projects.jsx      ← fetches from MongoDB
        │   ├── Services.jsx
        │   ├── Testimonials.jsx
        │   ├── Contact.jsx
        │   └── Footer.jsx
        └── admin/
            ├── AdminLogin.jsx
            ├── AdminDashboard.jsx
            ├── ProjectForm.jsx
            └── ProtectedRoute.jsx
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 16+ and npm
- A MongoDB Atlas account (already configured ✅)

### 1. Install all dependencies

```bash
# From the root portfolio/ folder
npm run install-all
```

This runs `npm install` in root, `server/`, and `client/`.

### 2. Start the development servers

```bash
# From the root portfolio/ folder
npm run dev
```

This starts:

- 🟢 **Backend** at `http://localhost:5000`
- 🔵 **Frontend** at `http://localhost:3000`

### 3. Open your browser

| URL                                 | Description       |
| ----------------------------------- | ----------------- |
| `http://localhost:3000`             | Portfolio website |
| `http://localhost:3000/admin/login` | Admin panel       |

### 4. Login to Admin

Default credentials (change in `server/.env`):

- **Email:** `admin@portfolio.com`
- **Password:** `Admin@1234`

### 5. Seed sample projects

In the Admin Dashboard → click **"Seed Sample Data"** button to populate 6 demo projects.

---

## 🛠️ Configuration

### `server/.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri_here
JWT_SECRET=change_this_to_something_secure_in_production
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=Admin@1234
```

### Customising your portfolio content

Edit these files to replace placeholder data with your own:

| File                                     | What to change                     |
| ---------------------------------------- | ---------------------------------- |
| `client/src/components/Hero.jsx`         | Name, title, social links          |
| `client/src/components/About.jsx`        | Bio, location, email, tech badges  |
| `client/src/components/Skills.jsx`       | Skill names and proficiency levels |
| `client/src/components/Services.jsx`     | Services you offer                 |
| `client/src/components/Testimonials.jsx` | Client reviews                     |
| `client/src/components/Contact.jsx`      | Email, location, social links      |
| `client/src/components/Footer.jsx`       | Logo, name, social links           |
| `client/public/index.html`               | Page title and meta description    |

---

## 🔌 API Endpoints

### Public

| Method | URL                 | Description                                    |
| ------ | ------------------- | ---------------------------------------------- |
| GET    | `/api/projects`     | Get all projects (filter: `?category=Web App`) |
| GET    | `/api/projects/:id` | Get single project                             |
| POST   | `/api/contact`      | Submit contact form                            |
| GET    | `/api/health`       | Health check                                   |

### Protected (requires JWT token)

| Method | URL                         | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/auth/login`           | Admin login → returns JWT |
| GET    | `/api/auth/verify`          | Verify token              |
| POST   | `/api/projects`             | Create project            |
| PUT    | `/api/projects/:id`         | Update project            |
| DELETE | `/api/projects/:id`         | Delete project            |
| POST   | `/api/projects/seed/sample` | Seed 6 demo projects      |
| GET    | `/api/contact`              | View all contact messages |
| PATCH  | `/api/contact/:id/read`     | Mark message as read      |
| DELETE | `/api/contact/:id`          | Delete message            |

---

## 🚢 Deployment

### Frontend (Vercel / Netlify)

```bash
cd client && npm run build
# Deploy the build/ folder
```

### Backend (Railway / Render / Heroku)

```bash
cd server
# Set environment variables in your host dashboard
# Deploy server/ folder
```

> ⚠️ **Remember:** Update `MONGODB_URI`, `JWT_SECRET`, `ADMIN_PASSWORD` and set `CORS` origins in `server.js` before deploying to production!

---

## 🎨 Design System

| Token      | Value                                            |
| ---------- | ------------------------------------------------ |
| Background | `#05050f`                                        |
| Glass      | `rgba(255,255,255,0.04)` + `backdrop-blur(16px)` |
| Primary    | `#6366f1` (Indigo)                               |
| Secondary  | `#8b5cf6` (Violet)                               |
| Accent     | `#06b6d4` (Cyan)                                 |
| Font       | Inter                                            |

---

Built with ❤️ using React, Tailwind CSS, Node.js, Express & MongoDB
