export type ResponseERP<T = null> = {
  status_code: number;
  message: string;
  data: T | null;
  errors: { field: string; message: string }[];
};

export type ResponseFindAll<T> = {
  entities: T[];
  meta: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
};
