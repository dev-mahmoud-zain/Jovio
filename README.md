# 🚀 Jovio

**Jovio** is a career-oriented platform designed to connect users with job opportunities through a structured, scalable, and role-aware system.

The project is built as a **training and skill-building initiative**, focusing on real-world backend architecture, API design, and team-based development workflows.
It follows a clear **Software Requirements Specification (SRS)** and is implemented with production-oriented practices in mind.

---

## 🎯 Project Vision
Jovio aims to simulate a real-world job platform where:
- Users can explore and apply for job opportunities
- Companies can manage profiles and post job openings
- Applications follow a clear lifecycle
- Communication and notifications are event-driven
- Access is controlled through roles and permissions

The goal is not just to build features, but to design a **clean, extensible system** that reflects how modern platforms are structured.

---

## 🧠 Core Focus Areas
- Modular backend architecture (NestJS)
- Clean separation of concerns
- Authentication & Authorization flows
- Role-based and resource-based access control
- Real-time communication & notifications
- API-first design driven by an SRS document
- Team collaboration and clean Git practices

---

## 🗂️ Project Structure

```bash
Jovio/
├── 📂 Server/        # Backend: NestJS Core & Business Logic
├── 📂 Client/        # Frontend: User Interface & State Management
├── 📂 docs/          # Documentation: SRS, API Maps & Architecture Notes
└── README.md         # Project Overview

```
---

## ⚙️ Backend – Server

### Responsibilities
- Expose a RESTful API
- Handle authentication, sessions, and security
- Enforce roles and permissions
- Manage core business logic and data consistency
- Trigger system events (notifications, chat, status changes)
- Support real-time features using WebSockets

### Tech Stack
- NestJS
- Node.js
- MongoDB
- JWT (Access & Refresh Tokens)
- Socket.IO

---

## 🎨 Frontend – Client

### Responsibilities
- Consume backend APIs
- Handle authentication and user sessions
- Present job, company, and application data
- Provide a clean and intuitive user experience
- Reflect system states and permissions visually

### Tech Stack
- Framework: TBD (React / Next.js / Angular)
- API Communication: REST
- State Management: TBD

---

## 📄 Documentation & Planning
All planning and design documents live inside the `docs` folder.

These documents act as the **single source of truth** for the system and include:
- Software Requirements Specification (SRS)
- API Endpoints Map
- Data models and relationships
- Authorization & access control flow

Development strictly follows these documents to avoid randomness and scope creep.

---

## 🔐 Environment Configuration
Each layer of the system manages its own environment configuration:

- Backend: `Server/.env`
- Frontend: `Client/.env`

Environment example files (`.env.example`) are provided to guide setup.

---

## 👥 Team

### Backend Developers
- Mahmoud Zain
- Hossam Ahmed

### Frontend Developers
- Rana Habashy
- Ahmed Adel
- Nader Elsayed
- Ahmed Salama
### UI/UX Designer
- Hadeer Mamdoh
- Rehab Hussin
- 
---

## 🛠️ Development Principles
- API-first development
- Clear separation between frontend and backend
- No business logic leakage between layers
- Soft deletes and state-based workflows
- Security and data consistency over shortcuts
- Scalable design over hardcoded solutions

---

## 🚧 Project Status
This project is currently under active development.
Features are implemented incrementally according to the defined roadmap and SRS.

---

## ✨ Final Note
Jovio is built as a **learning-by-building project**, with a strong emphasis on system design, code quality, and real-world engineering practices.