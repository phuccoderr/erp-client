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
      CookieStorageUtil.set(COOKIE_CONST.SESSION, data.data ?? "");
    },
  });
};

export { useCommandAuthLogin };
