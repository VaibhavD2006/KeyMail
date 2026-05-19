import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

const KEY_LENGTH = 64;
const HASH_PREFIX = "scrypt";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `${HASH_PREFIX}:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  passwordHash: string | undefined
): Promise<boolean> {
  if (!passwordHash) {
    return false;
  }

  const [algorithm, salt, storedKey] = passwordHash.split(":");
  if (algorithm !== HASH_PREFIX || !salt || !storedKey) {
    return false;
  }

  const storedKeyBuffer = Buffer.from(storedKey, "hex");
  if (storedKeyBuffer.length === 0) {
    return false;
  }

  const derivedKey = await scrypt(password, salt, storedKeyBuffer.length);
  return timingSafeEqual(storedKeyBuffer, derivedKey);
}
