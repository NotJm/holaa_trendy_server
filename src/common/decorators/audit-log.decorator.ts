import { SetMetadata } from "@nestjs/common"
import { ACTIONS_TYPE } from "../constants/contants";

export const AuditLog = (meta: AuditMeta): MethodDecorator => {
  return SetMetadata('audit', meta);
}

export interface AuditMeta {
  action: ACTIONS_TYPE,
  module: string,
  getEntityId?: (response: any) => string;
  oldValue?: any;
}
