import { FieldGroup, FieldSet, Input, Textarea } from "@components/ui";

import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";

interface UnitFormFieldProps {
  form: any;
}

const UnitFormField = ({ form }: UnitFormFieldProps) => {
  const { t } = useLang();

  return (
    <FieldSet>
      <FieldGroup>
        <Input
          isForm
          control={form.control}
          required
          label={t(LANG_KEY_CONST.UNIT_INPUT_NAME_TITLE)}
          name="name"
          placeholder={t(LANG_KEY_CONST.UNIT_INPUT_NAME_PLACEHOLDER)}
        />
        <Input
          isForm
          required
          control={form.control}
          label={t(LANG_KEY_CONST.UNIT_INPUT_CODE_TITLE)}
          name="code"
          placeholder={t(LANG_KEY_CONST.UNIT_INPUT_CODE_PLACEHOLDER)}
        />
        <Textarea
          isForm
          control={form.control}
          label={t(LANG_KEY_CONST.ROLE_INPUT_DESCRIPTION_TITLE)}
          name="description"
          placeholder={t(LANG_KEY_CONST.ROLE_INPUT_DESCRIPTION_PLACEHOLDER)}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default UnitFormField;
