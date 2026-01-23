# 🚀 Jovio – Server (Back-End)

Back-End service for **Jovio**, a scalable job & opportunity management platform.  
Built with a modular architecture to support companies, job opportunities, applications, notifications, and secure authentication.

---

## 🧠 Project Overview

**Jovio Server** is responsible for:
- Business logic
- Data persistence
- Authentication & authorization
- Communication with the client
- Handling real-world job application flows

The server is designed to be:
- **Scalable**
- **Modular**
- **Maintainable**
- **Team-friendly**

---

## 🛠 Tech Stack

- **Node.js**
- **NestJS**
- **TypeScript**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **OTP Service**
- **Docker (optional)**
- **RESTful API**

---

## 🗂 Folder Structure

```
server/
├── 📂 src/
│   ├── 🧱 app.module.ts        # Root module orchestrating the application
│   ├── 🚀 main.ts              # Entry point (Bootstrap & Middleware)
│   │
│   ├── 📂 modules/             # Feature-based business logic
│   │   ├── 🔐 auth/            # JWT, Passport, and Login flows
│   │   ├── 👤 user/            # Profile management & User data
│   │   ├── 🏢 company/         # Corporate profiles & Branding
│   │   ├── 💼 job-opportunity/ # Job postings & Search logic
│   │   ├── 📝 application/     # Job applications & Status tracking
│   │   └── 🔔 notification/    # Real-time alerts (Socket.io/Email)
│   │
│   ├── 📂 shared/              # Reusable cross-module logic
│   │   ├── 🔢 otp/             # One-Time Password generation/validation
│   │   ├── 🛡️ guards/          # RBAC & Auth protection
│   │   ├── 🏷️ decorators/      # Custom Metadata & Param decorators
│   │   └── 🛠️ utils/           # Global helper functions
│   │
│   ├── 📂 database/            # Infrastructure layer
│   │   └── 🍃 mongo.config.ts  # Mongoose connection & configuration
│   │
│   └── 📂 config/              # Centralized environment management
│       └── ⚙️ env.config.ts     # Type-safe environment variables
│
├── 📄 .env                    # Private environment keys
├── 📄 .env.example            # Template for environment setup
├── 📄 package.json            # Dependencies & Scripts
└── 📄 tsconfig.json           # TypeScript compiler configuration

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes using Guards
- OTP service for account verification and sensitive actions

---

## 🧩 Core Modules

### 🧑 User Module
- User registration & profile management
- Role assignment (Applicant / Company / Admin)

### 🏢 Company Module
- Company profile creation
- Company verification workflow
- Company-owned job management
- Search companies by name or activity

### 💼 Job Opportunity Module
- Create & manage job opportunities
- Job status control (open / closed)
- Search jobs by title, company, skills, and job type

### 📄 Application Module
- Apply to job opportunities
- Prevent duplicate applications
- Track application status

### 🔔 Notification Module
- System notifications
- Application updates
- Status change alerts

---

## ⚙ Environment Variables

Create a `.env` file inside `server/`:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/jovio
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
OTP_EXPIRES_IN=5m
```

---

## 🚀 Running the Server

```
cd server
npm install
npm run start:dev
```

Server will start on `http://localhost:5000`

---

## 👥 Team

Back-End Developers:

- Mahmoud Zain
- Hossam Ahmed

---

## 📄 License

Educational & team collaboration project.