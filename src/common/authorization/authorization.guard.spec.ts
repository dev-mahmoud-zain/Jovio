import { AuthorizationGuard } from './authorization.guard';

describe('AuthorizationGuard', () => {
  it('should be defined', () => {
    //@ts-ignore
    expect(new AuthorizationGuard()).toBeDefined();
  });
});
