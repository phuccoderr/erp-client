import type { BaseQuery } from "./base-query.type";
import type { Permission } from "./permission.type";

export type Role = {
  id: number;

  name: string;

  description: string;

  permissions: Permission[];

  created_at: number;

  updated_at: number | null;
};

export type CreateRole = {
  name: string;

  description: string;

  permission_ids: number[];
};

export type UpdateRole = Partial<CreateRole>;

export type FindAllRole = BaseQuery<Role> & {
  name?: string;
};

// RoleGroup
export type RoleGroup = {
  name: string;
  children: Permission[];
};
