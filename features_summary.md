# Jovio Project - Features Summary

This document summarizes the key features and functionalities implemented in the **Jovio** recruitment platform.

## 1. Authentication & Security
*   **Account Registration (Sign Up):** Includes email verification via OTP (One-Time Password).
*   **Google OAuth:** Support for Google Sign-In and Sign-Up.
*   **JWT Session Management:** Implementation of Access and Refresh tokens for secure authentication.
*   **Logout Mechanism:** Ability to log out from the current device or terminate all active sessions.
*   **Password Recovry:** Complete "Forget Password" flow using OTP verification.
*   **OTP Protection & Rate Limiting:** Security measures to prevent brute-force attacks on OTP codes, including temporary blocking after multiple failed attempts.
*   **Token Security:** Implementation of token blacklisting and rotation for enhanced security.

## 2. User Profile Management
*   **Basic Info Updates:** Update username, phone number, gender, date of birth, and status.
*   **Email Management:** Change email address with a multi-step verification process (OTP sent to the new email).
*   **Password Management:** Securely update user passwords with old password verification.
*   **Media Management:** Upload and manage profile and cover pictures via **Cloudinary** integration, maintaining a history of previous images.
*   **Account Operations:** Account freezing (Soft Delete) and restoration functionality.

## 3. Company Management
*   **Company Profile Creation:** Functionality to add new company details (name, email, location, employee count, etc.).
*   **Verification Workflow:** Initial setup for company status management (Pending/Approved).

## 4. Technical Infrastructure
*   **Repository Pattern:** A consistent abstraction layer for database operations (MongoDB/Mongoose).
*   **Centralized Response Handling:** Standardized success and error response formats.
*   **Event-Driven Email Service:** Decoupled email notifications using standard events.
*   **Automated Background Jobs (Cron):** Scheduled tasks for database maintenance, such as clearing expired OTP records.

---
*Last Updated: December 27, 2025*