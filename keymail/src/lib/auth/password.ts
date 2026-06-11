import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const HASH_PREFIX = "scrypt";
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${HASH_PREFIX}:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash) {
    return false;
  }

  const [algorithm, salt, hash] = storedHash.split(":");
  if (algorithm !== HASH_PREFIX || !salt || !hash) {
    return false;
  }

  const expectedKey = Buffer.from(hash, "hex");
  const derivedKey = (await scrypt(password, salt, expectedKey.length)) as Buffer;

  if (expectedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(expectedKey, derivedKey);
}
