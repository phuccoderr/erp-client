import type { BaseQuery } from "./base-query.type";

export type Permission = {
  id: number;

  resource: string;

  description: string;

  path: string;

  action: string;

  created_at: number;

  updated_at: number | null;
};

export type CreatePermission = {
  name: string;

  description: string;

  api_end_point_ids: number[];
};

export type FindAllPermission = BaseQuery<Permission> & {
  resource?: string;
};
