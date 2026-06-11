import crypto from "crypto";

// Use ENCRYPTION_KEY from environment, fallback to NEXTAUTH_SECRET, or a default fallback secret
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || "default-secret-key-32-chars-long-seoboostr";
const ALGORITHM = "aes-256-cbc";

// Helper to ensure key is exactly 32 bytes (256 bits)
function getKey(): Buffer {
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

/**
 * Encrypts a string using AES-256-CBC.
 * Returns the result in "iv:encryptedText" format.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a string in "iv:encryptedText" format.
 * If the string is not in the encrypted format, returns it as-is (plaintext fallback).
 */
export function decrypt(encryptedText: string): string {
  try {
    const parts = encryptedText.split(":");
    if (parts.length !== 2) {
      // Return text as-is if it's plaintext (pre-existing entries before encryption)
      return encryptedText;
    }
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
    const key = getKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    console.error("[Decryption Error] Failed to decrypt text, returning raw text:", e);
    return encryptedText;
  }
}
