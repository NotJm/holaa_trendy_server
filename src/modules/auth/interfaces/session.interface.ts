import { ROLE } from "src/common/constants/contants";

export interface ISession {
  active: boolean,
  role: ROLE
}