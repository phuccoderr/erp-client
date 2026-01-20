import http from "../http.api";

export class UserApi {
  static getMe() {
    const url = "/api/v1/users/me";
    return http.get(url);
  }
}
