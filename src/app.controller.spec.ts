import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return project info', () => {
      const expected = {
        projectName: 'Jovio',
        description: expect.any(String),
        version: expect.any(String),
        status: process.env.NODE_ENV || 'development',
        developer: {
          name: 'Mahmoud Zain',
          role: 'Backend Developer',
          note: expect.any(String),
        },
        modules: expect.any(Object),
        techStack: expect.any(Object),
        endpoints: expect.any(Object),
      };

      expect(appController.getInfo()).toEqual(
        expect.objectContaining(expected),
      );
    });
  });
});
