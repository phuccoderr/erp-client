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
import { LANG_KEY_CONST } from "@constants";
import { Checkbox } from "@components/ui";
import { useCommandAuthLogin, useFormAuthLogin } from "@hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryUserGetMe } from "@hooks/user";
import { Card } from "@components/ui";
import { useLang } from "@hooks/use-lang";
import { ButtonAnimated } from "@components/animations";
import { toast } from "sonner";

const FormLogin = () => {
  const { t } = useLang();
  const { data: me } = useQueryUserGetMe();
  const { mutate: mutateLogin, isPending } = useCommandAuthLogin();
  const { schema: loginSchema, form: loginForm } = useFormAuthLogin();
  const navigate = useNavigate();

  const onSubmitLogin = async (values: z.infer<typeof loginSchema>) => {
    mutateLogin(values, {
      onSuccess: () => {
        toast.success(t(LANG_KEY_CONST.AUTH_LOGIN_TOAST_LOGIN_SUCCESS));
        navigate("/", { replace: true });
      },
      onError: (err) => {
        console.log(err);
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
                  LANG_KEY_CONST.AUTH_LOGIN_INPUT_EMAIL_PLACEHOLDER
                )}
              />
              <Input
                isForm
                control={loginForm.control}
                name="password"
                placeholder={t(
                  LANG_KEY_CONST.AUTH_LOGIN_INPUT_PASSWORD_PLACEHOLDER
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
