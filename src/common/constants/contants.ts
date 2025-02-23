export const JWT_AGE = "15m";
export const REFRESH_JWT_AGE = "7d";
export const COOKIE_JWT_AGE = 15 * 60 * 1000;
export const COOKIE_REFRESH_JWT_AGE = 7 * 24 * 60 * 1000;
export const COOKIE_DEFAULT_AGE = 5 * 60 * 1000;
export const ROLES_KEY = "roles";
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
export const IV_LENGTH = 12;

