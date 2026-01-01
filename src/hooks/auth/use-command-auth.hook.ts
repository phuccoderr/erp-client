import { AuthApi } from "@apis";
import { TANSTACK_KEY_CONST, COOKIE_CONST } from "@constants";
import { useMutation } from "@tanstack/react-query";
import type { LoginAuthRequestDto, ResponseERP } from "@types";
import { CookieStorageUtil } from "@utils";

const useCommandAuthLogin = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.LOGIN_USER],
    mutationFn: (body: LoginAuthRequestDto) => {
      return AuthApi.login(body);
    },
    onSuccess: (data: ResponseERP<string>) => {
      if (data.data) {
        CookieStorageUtil.set(COOKIE_CONST.SESSION, data.data, {
          "max-age": 86400,
          sameSite: "lax",
        });
      }
    },
  });
};

export { useCommandAuthLogin };
