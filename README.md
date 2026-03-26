# ContactHub — MERN Contact Management App

> Full-stack Contact Management Web Application built with the **MERN Stack** (MongoDB · Express · React · Node.js).  
> Built for the INGLU Global FSD Role Assignment — Batch 2027.

---

## Live Demo

| Layer     | URL                          |
|-----------|------------------------------|
| Frontend  | *(add Vercel URL after deploy)*  |
| Backend   | *(add Render URL after deploy)*  |

---

## Features

| Feature | Details |
|---------|---------|
| ✅ Full CRUD | Create, Read, Update, Delete contacts |
| 🔍 Real-time Search | Search by name, email, phone, or company (debounced) |
| 🏷️ Category Filter | Work · Personal · Family · Friend · Other |
| ⭐ Favourites | Star / un-star any contact with one click |
| 📊 Dashboard Stats | Total, Starred, Categories Used, Showing Now |
| 🔃 Sorting | By first name, last name, or newest first |
| 🎨 Beautiful UI | Gradient navbar, animated cards, skeleton loading, modals |
| 📱 Responsive | Mobile-first, works on all screen sizes |
| 🔔 Toast Alerts | Feedback for every action |
| ✨ Animations | Fade-in, slide-up, scale-in with Tailwind |

---

## Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| nodemon | Dev auto-restart |

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 + Vite | UI library + dev server |
| Tailwind CSS 3 | Utility-first styling |
| Axios | HTTP client |
| React Hot Toast | Notification toasts |
| Lucide React | Icon library |

---

## Project Structure

```
Project/
├── backend/
│   ├── models/
│   │   └── Contact.js        # Mongoose schema + validation
│   ├── routes/
│   │   └── contacts.js       # CRUD + search/filter routes
│   ├── server.js             # Express app + MongoDB connect
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── StatsBar.jsx        # 4 dashboard stat cards
│   │   │   ├── SearchFilterBar.jsx # Search, sort, category, fav filter
│   │   │   ├── ContactCard.jsx     # Individual contact card
│   │   │   ├── ContactModal.jsx    # Add / Edit modal form
│   │   │   ├── DeleteModal.jsx     # Delete confirmation modal
│   │   │   └── EmptyState.jsx      # Empty / no-results state
│   │   ├── services/
│   │   │   └── api.js              # Axios API service layer
│   │   ├── App.jsx                 # Root component + global state
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Tailwind directives + utilities
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/contacts` | Get all contacts (supports `search`, `category`, `favorite`, `sort`) |
| `GET` | `/api/contacts/:id` | Get single contact by ID |
| `POST` | `/api/contacts` | Create a new contact |
| `PUT` | `/api/contacts/:id` | Update a contact |
| `DELETE` | `/api/contacts/:id` | Delete a contact |
| `PATCH` | `/api/contacts/:id/favorite` | Toggle favourite status |
| `GET` | `/api/health` | Health check |

### Contact Schema

```json
{
  "firstName":  "string (required)",
  "lastName":   "string",
  "email":      "string (validated)",
  "phone":      "string",
  "company":    "string",
  "address":    "string",
  "category":   "Work | Personal | Family | Friend | Other",
  "notes":      "string (max 500 chars)",
  "isFavorite": "boolean"
}
```

---

## Local Development

### Prerequisites
- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster (or local MongoDB)

### 1 — Clone & setup backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and paste your MongoDB Atlas connection string
npm run dev       # starts on http://localhost:5000
```

### 2 — Setup frontend

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

> The Vite dev server proxies `/api` → `http://localhost:5000` automatically — no extra config needed.

---

## Deployment

### Step 1 — Deploy Backend to Render (free)

1. Push the entire project to a GitHub repo.
2. Go to [render.com](https://render.com) → **New Web Service** → connect repo.
3. Set **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. Add **Environment Variables**:
   - `MONGODB_URI` → your MongoDB Atlas URI
   - `FRONTEND_URL` → *(leave blank for now; update after Vercel deploy)*
7. Click **Deploy**. Copy the service URL (e.g. `https://contacthub-api.onrender.com`).

### Step 2 — Deploy Frontend to Vercel (free)

1. Go to [vercel.com](https://vercel.com) → **New Project** → import the same GitHub repo.
2. Set **Root Directory**: `frontend`
3. Add **Environment Variable**:
   - `VITE_API_URL` → `https://contacthub-api.onrender.com/api`
4. Click **Deploy**. Copy the Vercel URL.

### Step 3 — Update CORS on backend

Go to Render → your backend service → **Environment** tab  
Update `FRONTEND_URL` to your Vercel URL → **Save** (triggers redeploy).

---

## Screenshots

> *(Add screenshots here after running the app)*

---

## Author

**Anmol Bhutani** — Chitkara University  
Assignment for: INGLU Global · FSD Role · Batch 2027
