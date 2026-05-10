import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const HASH_PREFIX = "scrypt";
const HASH_SEPARATOR = ":";
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return [HASH_PREFIX, salt, derivedKey.toString("hex")].join(HASH_SEPARATOR);
}

export async function verifyPassword(password: string, storedHash?: string | null) {
  if (!password || !storedHash) {
    return false;
  }

  const [scheme, salt, hash] = storedHash.split(HASH_SEPARATOR);
  if (scheme !== HASH_PREFIX || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  if (expected.length !== KEY_LENGTH) {
    return false;
  }

  const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
  return timingSafeEqual(actual, expected);
}
