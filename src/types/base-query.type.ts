export type BaseQuery<T> = {
  page?: number;

  limit?: number;

  sort?: keyof T;

  order?: "asc" | "desc";

  pagination: boolean;
};
