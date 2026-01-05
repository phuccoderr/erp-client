export type BaseQuery<T> = {
  page?: number;

  limit?: number;

  sort?: keyof T;

  order?: "ASC" | "DESC";

  pagination: boolean;
};
