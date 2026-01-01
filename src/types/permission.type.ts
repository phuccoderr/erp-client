import type { ApiEndPoint } from "./api-end-point.type";
import type { BaseQuery } from "./base-query.type";

export type Permission = {
  id: number;

  name: string;

  description: string;

  api_end_points: ApiEndPoint[];

  created_at: number;

  updated_at: number | null;
};

export type CreatePermission = {
  name: string;

  description: string;

  api_end_point_ids: number[];
};

export type FindAllPermission = BaseQuery & {
  name?: string;
};
