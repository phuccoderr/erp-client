import type { BaseEntity } from "./base-entity.type";
import type { BaseQuery } from "./base-query.type";

export type Category = BaseEntity & {
  name: string;

  description: string | null;

  is_active: boolean;

  parent_id: number | null;
};

export type CreateCategory = {
  name: string;

  description?: string;

  parent_id?: number | null;

  is_active?: boolean;
};

export type FindAllCategory = BaseQuery<Category> & {
  name?: string;
  is_active?: boolean;
};

export type UpdateCategory = Partial<CreateCategory>;

export type CategoryFieldSort = keyof Pick<
  Category,
  "name" | "description" | "created_at"
>;
