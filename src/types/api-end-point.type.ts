export type ApiEndPoint = {
  id: number;

  method: string;

  path: string;

  description: string | null;

  controller: string | null;

  action: string | null;
};
