export type BaseQuery<T> = {
  page?: number;

  take?: number;

  orderBy?: keyof T;

  order?: "asc" | "desc";

  pagination: boolean;
};
