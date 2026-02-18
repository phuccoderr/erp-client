import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldSet,
  Input,
} from "@components/ui";
import { z } from "zod";
import { COOKIE_CONST, LANG_KEY_CONST } from "@constants";
import { Checkbox } from "@components/ui";
import { Navigate, useNavigate } from "react-router-dom";
import { Card } from "@components/ui";
import { useLang } from "@hooks";
import { ButtonAnimated } from "@components/animations";
import { toast } from "sonner";
import type { ResponseERP } from "@types";
import { CookieStorageUtil } from "@utils";
import { useQueryUserGetMe } from "@apis/users";
import { useCommandAuthLogin, useFormAuthLogin } from "@apis/auth";

const FormLogin = () => {
  const { t } = useLang();
  const { data: me } = useQueryUserGetMe();
  const { mutate: mutateLogin, isPending } = useCommandAuthLogin();
  const { schema: loginSchema, form: loginForm } = useFormAuthLogin();
  const navigate = useNavigate();

  const onSubmitLogin = async (values: z.infer<typeof loginSchema>) => {
    mutateLogin(values, {
      onSuccess: (data: ResponseERP<string>) => {
        if (data.data) {
          CookieStorageUtil.set(COOKIE_CONST.SESSION, data.data, {
            "max-age": 86400,
            sameSite: "lax",
          });
        }
        toast.success(t(LANG_KEY_CONST.AUTH_LOGIN_TOAST_LOGIN_SUCCESS));
        navigate("/", { replace: true });
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  if (me) return <Navigate to={"/"} replace />;
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t(LANG_KEY_CONST.AUTH_LOGIN_TITLE)}</CardTitle>
        <CardDescription>
          {t(LANG_KEY_CONST.AUTH_LOGIN_SUBTITLE)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
          <FieldSet>
            <FieldGroup>
              <Input
                isForm
                control={loginForm.control}
                name="email"
                placeholder={t(
                  LANG_KEY_CONST.AUTH_LOGIN_INPUT_EMAIL_PLACEHOLDER,
                )}
              />
              <Input
                isForm
                control={loginForm.control}
                name="password"
                placeholder={t(
                  LANG_KEY_CONST.AUTH_LOGIN_INPUT_PASSWORD_PLACEHOLDER,
                )}
              />
              <Checkbox label={t(LANG_KEY_CONST.AUTH_LOGIN_CKCBOX_LOGIN)} />
              <Field className="items-end">
                <ButtonAnimated
                  disabled={isPending}
                  className="w-[30%]"
                  type="submit"
                >
                  {t(LANG_KEY_CONST.AUTH_LOGIN_BTN_LOGIN)}
                </ButtonAnimated>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormLogin;
