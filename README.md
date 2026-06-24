# MaxCV — Advanced Resume Builder & Customizer

MaxCV is a complete and secure Single Page Application (SPA) designed to build, customize, and export professional resumes. It features a modular, drag-and-drop drag-to-reorder resume editor, real-time typography and color customizers, and an administrative dashboard to manage user logs and accounts.

## 🚀 Features

### Student Portal
* **JWT Authentication**: Register secure profiles or login to receive standard stateless JWT tokens.
* **Flexible Personal Profile**: Input standard details, choose custom social media links (LinkedIn, GitHub, etc.), or define custom detail items.
* **Accordion Resume Builder**: Reorder or toggle visibility of sections dynamically. Add standard sections (Education, Experience, Skills) or insert infinite custom section cards (Projects, Certificates, Awards, Languages, Interests).
* **Live A4 Preview**: Instantly renders content updates. Customize layouts dynamically, adjusting margins (X/Y), typography families, base and heading font sizes, title alignments, contact Arrangements (row/column), icon styles (none/emoji/solid/outline), and accent colors in real-time.
* **Stateless Rich Text Editor**: Descriptions support formatting (bold, italic, underline, list types, alignments) using a custom `contenteditable` rich text toolbar.
* **Export System**: Export resumes directly to PDF, which logs export sessions and counts metrics.

### Admin Portal
* **Oversight Panel**: View all registered student accounts sorted by ID.
* **Data Integration Metrics**: Displays user profiles, registration dates, and user-owned resume counts dynamically.
* **Account Moderation**: View single student profiles or delete accounts cleanly (deletes all user resumes via cascade constraints).

---

## 🛠️ Technology Stack

* **Frontend (SPA)**: Vue 3 (Composition API `<script setup>`), Vue Router.
* **Styling & Layout**: Vanilla CSS with HSL tailored color schemes, sleek animations, and dynamic CSS variables mapped in real-time.
* **Backend REST API**: Node.js standard API running on the native `http` module.
* **Database & Security**:
  * Relational **SQLite database** using `better-sqlite3` with parameterized SQL inputs protecting against SQL injection.
  * Stateless token verification using **HMAC-SHA256 JWT** signatures from standard Node `crypto` modules.
  * Robust password hashing (using PBKDF2/scrypt algorithm checks).
  * Explicit route status returns (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`).

---

## 📂 Folder Structure

```text
├── server/
│   ├── data/                 # Seed database JSON exports
│   ├── database.sqlite       # Relational SQLite database
│   ├── index.js              # SQLite + JWT REST API Server
│   └── package.json          # Node CommonJS settings
├── src/
│   ├── assets/               # CSS styles & visual system
│   ├── components/
│   │   ├── resume/           # Resume forms, preview, & customize components
│   │   └── NavBar.vue        # Navigation & profile control
│   ├── composables/          # useResume.js reactive editor state
│   ├── services/
│   │   ├── auth.js           # API request router & JWT headers
│   │   └── store.js          # App global statistics store
│   ├── views/                # Views (Dashboard, Editor, Admin, Settings, etc.)
│   ├── App.vue               # Main app layout
│   └── main.js               # SPA entrypoint
├── index.html
├── package.json              # Client scripts & dependencies
└── vite.config.js
```

---

## 🏁 How to Run

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### 1. Install Dependencies
Install dependencies in the project root:
```bash
npm install
```

### 2. Start the Backend API Server
Start the SQLite REST API server (runs on `http://localhost:3000`):
```bash
npm run backend
```

### 3. Start the Frontend Development Server
Start the Vite dev server (runs on `http://localhost:5173`):
```bash
npm run dev
```

### 4. Build for Production
Compiles optimization bundles in `dist/`:
```bash
npm run build
```

---

## 🔑 Seeding / Demo Accounts

The SQLite database seeds itself automatically on first launch with these credential records (all passwords are set to `password`):

* **Admin Account**:
  * **Email**: `admin@maxcv.com`
  * **Password**: `password`
* **Student Account**:
  * **Email**: `alex.chen@example.com`
  * **Password**: `password`
* **Student Account 2**:
  * **Email**: `jamie.liu@school.edu`
  * **Password**: `password`
