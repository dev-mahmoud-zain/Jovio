# 🚀 Jovio - Recruitment Platform

**Jovio** is a scalable, modern recruitment platform built with **NestJS**. It features a robust technical infrastructure, secure authentication, and a comprehensive workflow for job management and applications.

---

## 🌟 Key Features

### 🔐 Authentication & Security
- **Secure Registration:** Email verification using **OTP** (One-Time Password).
- **Google OAuth:** Integrated Google Sign-In and Sign-Up.
- **Session Management:** Secure JWT implementation with **Access & Refresh tokens**.
- **Logout Options:** Log out from current device or terminate all active sessions.
- **Account Recovery:** Full "Forget Password" flow with OTP verification.
- **Security Protections:** 
  - OTP Rate Limiting & Brute-force protection.
  - Token blacklisting and rotation.

### 👤 User Profile Management
- **Profile Updates:** Manage username, phone, gender, DOB, and status.
- **Advanced Email Change:** Multi-step verification workflow for email updates.
- **Password Management:** Secure password changes with old password verification.
- **Media Support:** Profile and cover picture uploads integrated with **Cloudinary**.
- **Account Controls:** Soft delete (freezing) and restoration functionality.

### 🏢 Company & Job Management
- **Company Profiles:** Comprehensive management of company details.
- **Workflow Setup:** Initial verification workflows for company approval.
- **Job Management:** (Ongoing) Features for posting and managing job openings.

### 🛠 Technical Infrastructure
- **Pattern Driven:** Built using the **Repository Pattern** for clean data abstraction.
- **Centralized Handling:** Standardized response and error formats across the API.
- **Event-Driven:** Decoupled services (like Email) using local events.
- **Automated Jobs:** Scheduled **Cron jobs** for system maintenance (e.g., OTP cleanup).

---

## 💻 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Language:** TypeScript
- **Auth:** JWT, Google OAuth
- **Storage:** [Cloudinary](https://cloudinary.com/) (Media assets)
- **Email:** NodeMailer & Event-driven notifications
- **Validation:** Zod & Class-validator

---

## 📁 Project Structure

```text
src/
├── common/           # Interceptors, Decorators, Guards, Utils
├── database/         # Repositories, Schemas, Connection logic
├── modules/
│   ├── auth/         # Authentication & OAuth
│   ├── users/        # User management & Profiles
│   └── company/      # Company & Job logic
├── app.module.ts     # Main application module
└── main.ts           # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd jovio
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    Create a `config/.env` file based on the following template:
    ```env
    NODE_ENV=development
    PORT=3000
    LOCAL_DATA_BASE_URL=mongodb://localhost:27017/jovio
    JWT_ACCESS_SECRET=your_access_secret
    JWT_REFRESH_SECRET=your_refresh_secret
    # Cloudinary & Google OAuth credentials
    ```

### Running the App
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## 📝 How to Update this README

To keep this documentation accurate, please update the **Key Features** section whenever a new module or significant functionality is implemented. 
1. Add the new feature under the appropriate category.
2. If it's a new technical implementation, update the **Technical Infrastructure** section.
3. Keep the **Project Structure** tree updated if new top-level modules are added.

---
*Last Updated: December 27, 2025*
