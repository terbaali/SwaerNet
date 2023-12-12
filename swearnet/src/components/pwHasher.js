import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Funktio salasanan hashaukseen bcryptillä ja sha256:lla
export const hashPassword = async (password) => {
  try {
    const hashedBcrypt = await bcrypt.hash(password, 10);
    const sha256 = crypto.createHash('sha256');
    const hashedPassword = sha256.update(hashedBcrypt).digest('hex');

    //const pepper = 
    //const hashedPassword = crypto.createHash('sha256').update(hashedBcrypt + pepper).digest('hex');
    return hashedPassword;
  } 
  catch (error) {
    throw new Error('Error hashing password');
  }
};

export const comparePasswords = async (password, hashedPassword) => {
  try {
    const isBcryptMatch = await bcrypt.compare(password, hashedPassword);
    return isBcryptMatch;
  } 
  catch (error) {
    throw new Error('Error comparing passwords');
  }
};