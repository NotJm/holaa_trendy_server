import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('user_activity', { synchronize: false })
export class UserActivity {
  @ViewColumn()
  username: string

  @ViewColumn()
  role: string

  @ViewColumn()
  module: string

  @ViewColumn({ name: 'created_at'})
  createdAt: Date

  @ViewColumn()
  action: string
}