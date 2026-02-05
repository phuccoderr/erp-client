import http from "@apis/http.api";
import { API_BASE_URL } from "@constants";
import type { CreateCategory, FindAllCategory, UpdateCategory } from "@types";

const url = `${API_BASE_URL}/categories`;

export class CategoryApi {
  static async create(body: CreateCategory) {
    return (await http.post(url, body)).data;
  }
  static async findOne(id: number) {
    return (await http.get(`${url}/${id}`)).data;
  }

  static async findAll(query: FindAllCategory) {
    return (await http.get(url, { params: query })).data;
  }

  static async update(id: number, body: UpdateCategory) {
    return (await http.patch(`${url}/${id}`, body)).data;
  }

  static async deleteOne(id: number) {
    return http.delete(`${url}/${id}`);
  }
}
