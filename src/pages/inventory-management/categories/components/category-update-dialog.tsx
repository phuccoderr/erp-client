import { useCommandUpdateCategory } from "@apis/categories/category.command";
import { useFormCategory } from "@apis/categories/category.form";
import { DialogForm } from "@components/layouts";
import { DialogContent } from "@components/ui";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { useEffect } from "react";
import { z } from "zod";
import CategoryFormField from "./category-form-field.component";
import { toast } from "sonner";
import { useQueryCategory } from "@apis/categories/category.query";

interface CategoryUpdateDialogProps {
  cateId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CategoryUpdateDialog = ({
  isOpen,
  onOpenChange,
  cateId,
}: CategoryUpdateDialogProps) => {
  const { data: category } = useQueryCategory(cateId);
  const { mutate, isPending } = useCommandUpdateCategory();
  const { t } = useLang();
  const { form, schema } = useFormCategory();

  function onSubmitSave(body: z.infer<typeof schema>) {
    mutate(
      { id: cateId, body },
      {
        onSuccess: () => {
          onOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_KEY_CONST.QUERY_CATEGORY],
          });
          form.reset();
          toast.success(t(LANG_KEY_CONST.COMMON_SAVE_SUCCESS));
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  }

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description ?? "",
        parent_id: category.parent_id,
      });
    }
  }, [category]);

  return (
    <DialogForm
      title={t(LANG_KEY_CONST.CATEGORY_TITLE_UPDATE)}
      submitText={t(LANG_KEY_CONST.COMMON_SAVE)}
      idSubmit="category-update"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isPending={isPending}
    >
      <DialogContent>
        <form id="category-update" onSubmit={form.handleSubmit(onSubmitSave)}>
          <CategoryFormField form={form} cateId={cateId} />
        </form>
      </DialogContent>
    </DialogForm>
  );
};

export default CategoryUpdateDialog;
