import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return [HASH_PREFIX, salt, derivedKey.toString("hex")].join(":");
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  const [prefix, salt, storedKey] = passwordHash.split(":");
  if (prefix !== HASH_PREFIX || !salt || !storedKey) {
    return false;
  }

  const storedBuffer = Buffer.from(storedKey, "hex");
  if (storedBuffer.length !== KEY_LENGTH) {
    return false;
  }

  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return timingSafeEqual(storedBuffer, derivedKey);
}
