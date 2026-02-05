import type { BaseQuery } from "./base-query";

export type Unit = {
  id: number;

  name: string;

  code: string;

  description: string;

  created_at: number;

  updated_at: number | null;
};

export type UpdateUnit = Partial<CreateUnit>;

export type UnitFieldSort = keyof Pick<Unit, "name" | "code" | "description">;

export type CreateUnit = {
  name: string;

  code: string;

  description?: string;
};

export type FindAllUnit = BaseQuery<Unit> & {
  name?: string;
  code?: string;
};
