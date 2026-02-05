import { useQueryCategories } from "@apis/categories/category.query";
import { FieldGroup, FieldSet, Input, Textarea } from "@components/ui";
import { ComboboxSelect } from "@components/ui/combobox";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import type { Category } from "@types";

interface CategoryFormFieldProps {
  form: any;
}

const CategoryFormField = ({ form }: CategoryFormFieldProps) => {
  const { t } = useLang();
  const { data: categories } = useQueryCategories({
    pagination: false,
    is_active: true,
  });

  return (
    <FieldSet>
      <FieldGroup>
        <Input
          isForm
          control={form.control}
          required
          label={t(LANG_KEY_CONST.CATEGORY_INPUT_NAME_TITLE)}
          name="name"
          placeholder={t(LANG_KEY_CONST.CATEGORY_INPUT_NAME_PLACEHOLDER)}
        />
        <Textarea
          isForm
          control={form.control}
          label={t(LANG_KEY_CONST.CATEGORY_FIELD_DESCRIPTION)}
          name="description"
          placeholder={t(LANG_KEY_CONST.CATEGORY_INPUT_DESCRIPTION_PLACEHOLDER)}
        />
        <ComboboxSelect<Category>
          items={categories?.entities}
          control={form.control}
          label="Parent"
          name="parent_id"
          keyToString="name"
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default CategoryFormField;
