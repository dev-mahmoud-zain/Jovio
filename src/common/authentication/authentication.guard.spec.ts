import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  it('should be defined', () => {
    //@ts-ignore
    expect(new AuthenticationGuard()).toBeDefined();
  });
});
