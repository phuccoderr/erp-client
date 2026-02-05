import { useCommandCreateCategory } from "@apis/categories/category.command";
import { useFormCategory } from "@apis/categories/category.form";
import { DialogForm } from "@components/layouts";
import { DialogContent } from "@components/ui";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { memo } from "react";
import { z } from "zod";
import CategoryFormField from "./category-form-field.component";
import { toast } from "sonner";

interface CategoryCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CategoryCreateDialog = memo(
  ({ isOpen, onOpenChange }: CategoryCreateDialogProps) => {
    const { mutate, isPending } = useCommandCreateCategory();
    const { t } = useLang();
    const { form, schema } = useFormCategory();

    const onSubmitSave = (body: z.infer<typeof schema>) => {
      mutate(body, {
        onSuccess: () => {
          onOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_KEY_CONST.QUERY_CATEGORY],
          });
          form.reset();
          toast.success(t(LANG_KEY_CONST.COMMON_CREATE_SUCCESS));
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });
    };

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
  },
);

export default CategoryCreateDialog;
