export type ResponseERP<T = null> = {
  status_code: number;
  message: string;
  data: T | null;
  errors: { field: string; message: string }[];
};
