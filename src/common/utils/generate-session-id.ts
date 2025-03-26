import * as crypto from 'crypto';

export const generateSessionId = (): string => {
  return crypto.randomUUID()
}