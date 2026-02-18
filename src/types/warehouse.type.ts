import type { BaseQuery } from "./base-query.type";

export type WarehouseTypeEnum = {
  MAIN: "MAIN";
  BRANCH: "BRANCH";
  TEMPORARY: "TEMPORARY";
  TRANSIT: "TRANSIT";
};

export type Warehouse = {
  id: number;

  name: string;

  code: string;

  address: string | null;

  phone: string | null;

  type: WarehouseTypeEnum;

  is_active: boolean | null;

  manager: number;

  created_at: number;

  updated_at: number | null;
};

export type CreateWarehouse = {
  name: string;

  code: string;

  address?: string;

  phone?: string;

  type: WarehouseTypeEnum;

  is_active?: boolean;

  manager_id?: number;
};

export type UpdateWarehouse = Partial<CreateWarehouse>;

export type FindAllWarehouse = BaseQuery<Warehouse> & {
  code?: string;
  name?: string;
  type?: WarehouseTypeEnum;
  is_active?: boolean;
};
