import { DialogForm } from "@components/layouts";
import { DialogContent } from "@components/ui";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { memo } from "react";
import { toast } from "sonner";
import { z } from "zod";
import UnitFormField from "./unit-form-field.component";
import { useCommandCreateUnit, useFormUnit } from "@apis/units";

interface UnitCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const UnitCreateDialog = memo(
  ({ isOpen, onOpenChange }: UnitCreateDialogProps) => {
    const { mutate, isPending } = useCommandCreateUnit();
    const { t } = useLang();
    const { form, schema } = useFormUnit();

    const onSubmitSave = (body: z.infer<typeof schema>) => {
      mutate(body, {
        onSuccess: () => {
          onOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_KEY_CONST.QUERY_UNIT],
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
        title={t(LANG_KEY_CONST.UNIT_TITLE_ADD)}
        submitText={t(LANG_KEY_CONST.COMMON_CREATE)}
        idSubmit="unit-create"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isPending={isPending}
      >
        <DialogContent>
          <form id="unit-create" onSubmit={form.handleSubmit(onSubmitSave)}>
            <UnitFormField form={form} />
          </form>
        </DialogContent>
      </DialogForm>
    );
  },
);

export default UnitCreateDialog;
