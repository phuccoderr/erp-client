export type BaseQuery = {
  page?: number;

  limit?: number;

  sort?: string;

  order?: "ASC" | "DESC";

  pagination: boolean;
};
