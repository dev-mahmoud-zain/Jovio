import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  mainRoute() {



    console.log({url : process.env.DB_URL})

    return {
      project: 'Jovio',
      description: 'Career-oriented platform to connect users with jobs via a scalable, role-aware system.',
      modules: {
        auth: 'Registration, login, JWT auth, OTP verification',
        user: 'Profile management, roles, status',
        company: 'Company management, verification, search, job posting',
        jobOpportunity: 'CRUD jobs, search, filter, status control',
        application: 'Job applications, status tracking',
        notification: 'System notifications, read/unread, delete',
        chat: 'Application-based messaging (planned)'
      },
      techStack: {
        backend: ['NestJS', 'Node.js', 'TypeScript'],
        database: ['MongoDB', 'Mongoose'],
        authentication: ['JWT', 'OTP'],
        realtime: 'Socket.IO (future)',
        api: 'RESTful APIs'
      },
      documentation: 'All planning and design documents in /docs including SRS, API endpoints, data models, roles & permissions',
      environment: {
        backendEnv: 'Server/.env',
        frontendEnv: 'Client/.env'
      },
      team: {
        backendDevelopers: 2,
        frontendDevelopers: 2,
        uiUxDesigner: 1
      },
      purpose: 'Learning, skill-building, and team collaboration'
    };
  }
}
