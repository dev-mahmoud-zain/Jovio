import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      projectName: 'Jovio',
      description:
        'A recruitment platform providing job matching, company management, admin controls, chat, and real-time hiring workflows.',
      version: '1.0.0',
      status: 'running',
      developer: {
        name: 'Mahmoud Zain',
        role: 'Backend Developer',
        note: 'This project is fully developed and implemented by Mahmoud Zain.',
      },
      modules: {
        auth: {
          summary:
            'Complete authentication with OTP, Google OAuth, password reset, refresh token.',
        },
        users: {
          summary:
            'User profile management, secure updates, media upload, soft delete.',
        },
        adminDashboard: {
          summary: 'GraphQL admin panel with user/company moderation.',
        },
        companies: {
          summary:
            'Company creation, update, soft delete, job relations, search, media upload.',
        },
        jobs: {
          summary:
            'Full job lifecycle: creation, update, listing, filtering, applications, and notifications.',
        },
        chat: {
          summary: 'Real-time HR ↔ User messaging using Socket.IO.',
        },
      },
      keyFeatures: [
        'Email verification via OTP',
        'Google OAuth signup & login',
        'Password reset flow',
        'Refresh token rotation',
        'Encrypted mobile numbers',
        'User media upload (profile/cover)',
        'Company logos & cover pictures',
        'GraphQL admin dashboard',
        'Job filtering & pagination',
        'Job applications with user details',
        'Acceptance/Rejection email system',
        'Real-time notifications via Socket.io',
        'CRON job for deleting expired OTPs',
      ],
      techStack: {
        backend: 'NestJS (Node.js)',
        database: 'MongoDB + Mongoose',
        auth: 'JWT + OTP + Google OAuth2',
        realtime: 'Socket.io (Gateway)',
        admin: 'GraphQL (Code-First)',
        scheduler: 'Nest Schedule / node-cron',
        email: 'Nodemailer',
      },
      endpoints: {
        auth: '/auth',
        users: '/users',
        companies: '/companies',
        jobs: '/jobs',
        admin: '/admin',
        chat: '/chat',
      },
    };
  }
}