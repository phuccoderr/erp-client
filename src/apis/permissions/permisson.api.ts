import type { CreatePermission, FindAllPermission } from "@types";
import http from "../http.api";
import { API_BASE_URL } from "@constants";

const url = `${API_BASE_URL}/permissions`;

export class PermissionApi {
  static async create(body: CreatePermission) {
    return (await http.post(url, body)).data;
  }
  static async findOne(id: number) {
    return http.get(`${url}/${id}`);
  }

  static async findAll(query: FindAllPermission) {
    return (await http.get(url, { params: query })).data;
  }
}
