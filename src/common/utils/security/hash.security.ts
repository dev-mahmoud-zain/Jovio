import { hash, compare } from 'bcrypt';

export const generateHash = async (
  plainText: string,
  saltRound: number = parseInt(process.env.SALT_ROUND as string),
): Promise<string> => {
  return await hash(plainText, saltRound);
};

export const compareHash = async (
  plainText: string,
  hashedText: string,
): Promise<Boolean> => {
  return await compare(plainText, hashedText);
};
