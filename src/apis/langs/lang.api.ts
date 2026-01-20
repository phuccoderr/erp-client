import type { FindAllLang } from "@types";
import http from "../http.api";
import { API_BASE_URL } from "@constants";

const url = `${API_BASE_URL}/langs`;

export class LangApi {
  static async findOne(id: number) {
    return http.get(`${url}/${id}`);
  }

  static async findAll(query: FindAllLang) {
    return (await http.get(url, { params: query })).data;
  }
}
