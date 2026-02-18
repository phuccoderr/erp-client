import { useQueryCategories } from "@apis/categories/category.query";
import { FieldGroup, FieldSet, Input, Textarea } from "@components/ui";
import { ComboboxSelectForm } from "@components/ui/combobox.new";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import type { Category } from "@types";
import { useMemo } from "react";

interface CategoryFormFieldProps {
  form: any;
  cateId?: number;
}

const CategoryFormField = ({ form, cateId }: CategoryFormFieldProps) => {
  const { t } = useLang();
  const { data: categories } = useQueryCategories({
    pagination: false,
    is_active: true,
  });
  const listCategories = useMemo(() => {
    const childrenMap = new Map<number, Category[]>();

    categories?.entities.forEach((cate) => {
      if (cate.parent_id !== null) {
        if (!childrenMap.has(cate.parent_id)) {
          childrenMap.set(cate.parent_id, []);
        }
        childrenMap.get(cate.parent_id)!.push(cate);
      }
    });

    const idsToExclude = new Set<number>();

    const collectSubtree = (currentId: number) => {
      if (idsToExclude.has(currentId)) return;
      idsToExclude.add(currentId);

      const children = childrenMap.get(currentId) || [];
      children.forEach((child) => {
        collectSubtree(child.id);
      });
    };

    collectSubtree(cateId ?? 0);

    const availableParents = categories?.entities.filter(
      (cate) => !idsToExclude.has(cate.id),
    );
    return availableParents;
  }, [cateId, categories]);

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
        <ComboboxSelectForm
          name="parent_id"
          control={form.control}
          label="parent"
          valueKey="id"
          options={listCategories ?? []}
          labelKey="name"
        />
        <Textarea
          isForm
          control={form.control}
          label={t(LANG_KEY_CONST.CATEGORY_FIELD_DESCRIPTION)}
          name="description"
          placeholder={t(LANG_KEY_CONST.CATEGORY_INPUT_DESCRIPTION_PLACEHOLDER)}
        />
      </FieldGroup>
    </FieldSet>
  );
};

export default CategoryFormField;
