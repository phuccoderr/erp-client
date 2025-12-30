import {
  Button,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldGroup,
  FieldSet,
  Input,
  Typography,
} from "@components/ui";
import { z } from "zod";
import { LANG_KEY_CONST } from "@constants";
import { Checkbox } from "@components/ui";
import { useCommandAuthLogin, useFormAuthLogin } from "@hooks/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryUserGetMe } from "@hooks/user";
import { Card } from "@components/ui";

const FormLogin = () => {
  const { data: me } = useQueryUserGetMe();
  const { mutate: mutateLogin } = useCommandAuthLogin();
  const { schema: loginSchema, form: loginForm } = useFormAuthLogin();
  const navigate = useNavigate();

  const onSubmitLogin = async (values: z.infer<typeof loginSchema>) => {
    mutateLogin(values, {
      onSuccess: () => {
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
        <CardTitle>{LANG_KEY_CONST.AUTH.LOGIN_TITLE}</CardTitle>
        <CardDescription>{LANG_KEY_CONST.AUTH.LOGIN_SUBTITLE}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
          <FieldSet>
            <FieldGroup>
              <Input
                isForm
                control={loginForm.control}
                name="email"
                placeholder={LANG_KEY_CONST.AUTH.LOGIN_INPUT_PLACE_EMAIL}
              />
              <Input
                isForm
                control={loginForm.control}
                name="password"
                placeholder={LANG_KEY_CONST.AUTH.LOGIN_INPUT_PLACE_PASSWORD}
              />
              <Checkbox label={LANG_KEY_CONST.AUTH.LOGIN_CKCBOX_REMEMBER} />
              <Field className="items-end">
                <Button className="w-[30%]" type="submit">
                  {LANG_KEY_CONST.AUTH.LOGIN_BTN_LOGIN}
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormLogin;
