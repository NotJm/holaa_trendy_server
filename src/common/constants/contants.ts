export const JWT_AGE = '15m';
export const JWT_AGE_IN_MINUTES = 15;
export const REFRESH_JWT_AGE = '7d';
export const COOKIE_JWT_AGE = 15 * 60 * 1000;
export const COOKIE_REFRESH_JWT_AGE = 7 * 24 * 60 * 1000;
export const COOKIE_DEFAULT_AGE = 5 * 60 * 1000;

export const ROLES_KEY = 'roles';
export enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
  EMPLOYEE = 'employee',
  SUPPORT = 'support',
}

export enum ACCOUNT_STATE {
  ACTIVED = 'ACTIVED',
  DESACTIVED = 'DESACTIVED',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED'

}

export const OTP_LIFE_TIME = 300;
export const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export const BASE_BLOCK_DURATION = 5 * 60 * 1000;
export const MAX_ATTEMPTS_NORMAL = 5;
export const MAX_ATTEMPTS_STRONG = 10;
export const MAX_ATTEMPTS_IP_BAN = 15;

export enum INCIDENTS_TYPE {
  LOGIN_FAILED = 'login failed',
  MFA_FAILED = 'mfa failed',
}
export enum INCIDENT_STATE {
  PENDING = 'pending',
  UNDER_REVIEW = 'under review',
  IN_PROGRESS = 'in progress',
  REQUIRES_INFO = 'requires info',
  RESOLVED = 'resolved',
  NOT_REPRODUCED = 'not reproduced',
  DISMISSED = 'dismissed',
  CLOSED = 'closed',
  REOPENED = 'reopened',
}


export const LOCK_TIME_MINUTES = 15;
export const IV_LENGTH = 12;
