/** Duracion de un Json Web Token es de 15 minutos */
export const JWT_AGE = "15m";
/** Duracion de un JWT para refrescar 7 dias */
export const REFRESH_JWT_AGE = "7d";
/** Duracion estandar de una cookie para JWT */
export const COOKIE_JWT_AGE = 15 * 60 * 1000;
export const COOKIE_REFRESH_JWT_AGE = 7 * 24 * 60 * 1000;
/** Duracion de la cookie es de 5 minutos */
export const COOKIE_DEFAULT_AGE = 5 * 60 * 1000;
/** Clave Necesaria para la autenticacion de roles */
export const ROLES_KEY = "roles";
/** Enumeracion de roles */
export enum ROLE {
    ADMIN = "admin",
    USER = "user",
    EMPLOYEE = "employee",
    SUPPORT = "support"

}

export const OTP_LIFE_TIME = 300;

export const BLOCK_DURATION = 15 * 60 * 1000;

export const MAX_ATTEMPTS = 3;

export const LOCK_TIME_MINUTES = 15;

