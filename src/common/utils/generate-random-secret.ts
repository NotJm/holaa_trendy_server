import * as crypto from 'crypto';

/**
 * Generates a random secret 
 * @returns A string containing the random secret
 */
export function generateRandomSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}