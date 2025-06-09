/**
 * Genera una fecha de expiracion para un token
 * @param durationInMinutes Duracion en minutos para el token
 * @returns Fecha de expiracion
 */
export function generateExpirationDate(durationInMinutes: number = 60): Date {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + durationInMinutes);
  return expirationDate;
}