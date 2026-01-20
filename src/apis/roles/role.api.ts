import { API_BASE_URL } from "@constants";
import http from "../http.api";
import { type CreateRole, type FindAllRole, type UpdateRole } from "@types";

const url = `${API_BASE_URL}/roles`;

export class RoleApi {
  static async create(body: CreateRole) {
    return (await http.post(url, body)).data;
  }
  static async findOne(id: number) {
    return (await http.get(`${url}/${id}`)).data;
  }

  static async findAll(query: FindAllRole) {
    return (await http.get(url, { params: query })).data;
  }

  static async update(id: number, body: UpdateRole) {
    return (await http.patch(`${url}/${id}`, body)).data;
  }

  static async deleteOne(id: number) {
    return http.delete(`${url}/${id}`);
  }
}
