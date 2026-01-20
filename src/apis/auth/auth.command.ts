import { TANSTACK_KEY_CONST } from "@constants";
import { useMutation } from "@tanstack/react-query";
import type { LoginAuthRequestDto } from "@types";
import { AuthApi } from "./auth.api";

const useCommandAuthLogin = () => {
  return useMutation({
    mutationKey: [TANSTACK_KEY_CONST.LOGIN_USER],
    mutationFn: (body: LoginAuthRequestDto) => {
      return AuthApi.login(body);
    },
  });
};

export { useCommandAuthLogin };
