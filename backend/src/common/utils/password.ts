import bcrypt from "bcrypt";

const hashSalt: number = 10;
  
export async function hashPassword(
  password: string
): Promise<string> {
  return bcrypt.hash(password, hashSalt);
}


export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}