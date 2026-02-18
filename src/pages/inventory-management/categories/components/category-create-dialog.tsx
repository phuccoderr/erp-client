import { useCommandCreateCategory } from "@apis/categories/category.command";
import { useFormCategory } from "@apis/categories/category.form";
import { DialogForm } from "@components/layouts";
import { DialogContent } from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { z } from "zod";
import CategoryFormField from "./category-form-field";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Category } from "@types";

interface CategoryCreateDialogProps {
  cateId?: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onNewData?: (category: Category) => void;
}

const CategoryCreateDialog = ({
  cateId,
  isOpen,
  onOpenChange,
  onNewData,
}: CategoryCreateDialogProps) => {
  const { mutate, isPending } = useCommandCreateCategory();
  const { t } = useLang();
  const { form, schema } = useFormCategory();

  function onSubmitSave(body: z.infer<typeof schema>) {
    mutate(body, {
      onSuccess: (data: Category) => {
        onNewData?.(data);
        onOpenChange(false);
        form.reset();
        toast.success(t(LANG_KEY_CONST.COMMON_CREATE_SUCCESS));
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  }

  useEffect(() => {
    if (cateId) {
      form.reset({
        parent_id: cateId,
      });
    }
  }, [cateId]);

  return (
    <DialogForm
      title={t(LANG_KEY_CONST.CATEGORY_TITLE_ADD)}
      submitText={t(LANG_KEY_CONST.COMMON_CREATE)}
      idSubmit="category-create"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isPending={isPending}
    >
      <DialogContent>
        <form id="category-create" onSubmit={form.handleSubmit(onSubmitSave)}>
          <CategoryFormField form={form} />
        </form>
      </DialogContent>
    </DialogForm>
  );
};

export default CategoryCreateDialog;
