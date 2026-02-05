import type { BaseQuery } from "./base-query";

export type Lang = {
  id: number;

  code: string;

  vi: string;

  en: string;

  created_at: number;

  updated_at: number | null;
};

export type CreateLang = {
  code: string;

  vi: string;

  en: number[];
};

export type FindAllLang = BaseQuery<Lang>;
