import type { LoginAuthRequestDto } from "@types";
import http from "../http.api";

export class AuthApi {
  static async login(body: LoginAuthRequestDto) {
    const url = "/api/v1/auth";
    return (await http.post(url, body)).data;
  }
}
