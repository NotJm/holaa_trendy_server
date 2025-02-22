/**
 * Generates a expiration date for a token
 * @param durationInMinutes Duration in minutes to validate the token 
 * @returns The expiration date the token
 */
export function generateExpirationDate(durationInMinutes: number = 60): Date {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + durationInMinutes);
  return expirationDate;
}