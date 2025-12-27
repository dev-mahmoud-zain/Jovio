import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export const encrypt = (plainText: string): string => {
  const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
  const SALT_ROUND = process.env.SALT_ROUND;
  
  
  if (!ENCRYPT_KEY || !SALT_ROUND) {
    throw new Error("ENCRYPT_KEY or SALT_ROUND is not defined in .env");
  }

  const key = crypto.scryptSync(ENCRYPT_KEY, SALT_ROUND, 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (cipherText: string): string => {
  const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
  const SALT_ROUND = process.env.SALT_ROUND;

  if (!ENCRYPT_KEY || !SALT_ROUND) {
    throw new Error("ENCRYPT_KEY or SALT_ROUND is not defined in .env");
  }

  const key = crypto.scryptSync(ENCRYPT_KEY, SALT_ROUND, 32);
  const [ivHex, encrypted] = cipherText.split(':');

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, 'hex')
  );

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
