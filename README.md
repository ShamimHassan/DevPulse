# DevPulse

> Live Link: https://dev-pulse-puce.vercel.app/
> Internal Tech Issue & Feature Tracker
> 
> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

---

## 📋 Features

- 🔐 **User Authentication**: JWT-based login and registration
- 👥 **Roles & Permissions**: Contributors and Maintainers with different access levels
- 🐛 **Issue Management**: Create, view, update, and delete bug reports and feature requests
- 🔍 **Filtering & Sorting**: Filter issues by type/status and sort by newest/oldest
- 📊 **Clean API**: RESTful API with standardized responses

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | LTS runtime (24.x or higher) |
| TypeScript | Type-safe development |
| Express.js | Web framework |
| PostgreSQL | Relational database |
| bcrypt | Password hashing |
| jsonwebtoken | JWT generation & verification |
| http-status-codes | HTTP status codes |
| cors | Cross-origin resource sharing |
| dotenv | Environment variable management |

---

## 📦 Setup Steps

### Prerequisites

- Node.js 24.x or higher
- npm or yarn
- PostgreSQL database (local or hosted on NeonDB/Supabase/ElephantSQL)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/devpulse.git
cd devpulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://your-username:your-password@your-host/your-database
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Initialize Database

```bash
npm run init-db
```

### 5. Start the Development Server

```bash
npm start
```

The server will be running at `http://localhost:3000`

---

## 🌐 API Endpoint List

### Authentication Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Authenticate and get token | Public |

### Issues Module

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/issues` | Get all issues (filter/sort) | Public |
| GET | `/api/issues/:id` | Get a single issue | Public |
| POST | `/api/issues` | Create a new issue | Authenticated |
| PATCH | `/api/issues/:id` | Update an issue | Authenticated |
| DELETE | `/api/issues/:id` | Delete an issue | Maintainer only |

---

## 🗄️ Database Schema Summary

### `users` Table

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL | Auto-incrementing unique identifier |
| name | VARCHAR(255) | Full name of the user |
| email | VARCHAR(255) | Unique email address |
| password | VARCHAR(255) | Hashed password |
| role | VARCHAR(50) | Role (contributor/maintainer) |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

### `issues` Table

| Field | Type | Description |
|-------|------|-------------|
| id | SERIAL | Auto-incrementing unique identifier |
| title | VARCHAR(150) | Issue title |
| description | TEXT | Detailed description (min 20 chars) |
| type | VARCHAR(50) | Issue type (bug/feature_request) |
| status | VARCHAR(50) | Status (open/in_progress/resolved) |
| reporter_id | INTEGER | ID of the user who reported |
| created_at | TIMESTAMP | Issue creation time |
| updated_at | TIMESTAMP | Last update time |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **contributor** | Register, login, create issues, view all issues |
| **maintainer** | All contributor permissions + update/delete any issue |

---

## 🧪 Demo Data

To populate the database with demo data:

```bash
npm run demo
```

This will create:
- 5 demo users
- 20 demo issues
- 5 updated issues

---

## 👤 Author

Md Shamim Hassan

---

**Good luck! 🚀**
