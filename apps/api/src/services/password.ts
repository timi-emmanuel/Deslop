import crypto from "node:crypto";

/**
 * LESSON: Cryptographic Password Hashing & Timing Attacks
 * --------------------------------------------------------
 * 1. Why Salts Matter:
 *    If two users have the password "hunter2", a naive SHA-256 hash would produce
 *    the exact same string for both. Attackers use precomputed "Rainbow Tables" to
 *    reverse millions of common hashes instantly.
 *    By generating 16 cryptographically random bytes for every password, identical
 *    passwords produce completely distinct hashes.
 *
 * 2. Memory-Hard KDFs (Scrypt):
 *    Scrypt is designed to be expensive in memory and CPU time. It forces any attacker
 *    attempting brute force to allocate significant RAM per attempt, neutralizing
 *    massively parallel GPU cracking rigs.
 *
 * 3. Timing Attacks & timingSafeEqual:
 *    Normal string comparison (`hashA === hashB`) returns `false` as soon as the first
 *    different character is found. An attacker measuring response times in nanoseconds
 *    can guess the hash character-by-character.
 *    `crypto.timingSafeEqual` always takes the exact same number of clock cycles regardless
 *    of where a mismatch occurs.
 */

const KEY_LENGTH = 64; // 64 bytes (512 bits)
const SCRYPT_OPTIONS: crypto.ScryptOptions = {
  N: 16384, // CPU/memory cost parameter (2^14)
  r: 8,     // Block size parameter
  p: 1,     // Parallelization parameter
};

function scryptPromise(
  password: string,
  salt: string,
  keylen: number,
  options: crypto.ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

/**
 * Hashes a plaintext password into a serialized salt+hash string.
 * Output format: `scrypt$16384$8$1$<salt_hex>$<derived_key_hex>`
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptPromise(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return `scrypt$16384$8$1$${salt}$${derivedKey.toString("hex")}`;
}

/**
 * Verifies a candidate password against a stored serialized hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") {
    return false;
  }

  const [, nStr, rStr, pStr, salt, expectedHashHex] = parts;
  const options: crypto.ScryptOptions = {
    N: parseInt(nStr, 10),
    r: parseInt(rStr, 10),
    p: parseInt(pStr, 10),
  };

  const expectedKey = Buffer.from(expectedHashHex, "hex");
  const derivedKey = await scryptPromise(password, salt, expectedKey.length, options);

  if (expectedKey.length !== derivedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedKey, derivedKey);
}
