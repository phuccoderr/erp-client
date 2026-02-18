import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { useEffect } from "react";
import { toast } from "sonner";
import type z from "zod";
import UnitFormField from "./unit-form-field";
import { DialogContent } from "@components/ui";
import { DialogForm } from "@components/layouts";
import { useCommandUpdateUnit, useFormUnit, useQueryUnit } from "@apis/units";

interface UnitUpdateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  unitId: number;
}

const UnitUpdateDialog = ({
  unitId,
  isOpen,
  onOpenChange,
}: UnitUpdateDialogProps) => {
  const { data: unit } = useQueryUnit(unitId);
  const { mutate, isPending } = useCommandUpdateUnit();
  const { t } = useLang();
  const { form, schema } = useFormUnit();

  const onSubmitSave = (body: z.infer<typeof schema>) => {
    mutate(
      { id: unitId, body },
      {
        onSuccess: () => {
          onOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_KEY_CONST.QUERY_UNIT],
          });
          toast.success(t(LANG_KEY_CONST.COMMON_SAVE_SUCCESS));
          form.reset();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  useEffect(() => {
    if (unit) {
      form.reset({
        name: unit.name,
        code: unit.code,
        description: unit.description ?? "",
      });
    }
  }, [unit]);

  return (
    <DialogForm
      title={t(LANG_KEY_CONST.UNIT_TITLE_ADD)}
      submitText={t(LANG_KEY_CONST.COMMON_SAVE)}
      idSubmit="unit-update"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isPending={isPending}
    >
      <DialogContent>
        <form id="unit-update" onSubmit={form.handleSubmit(onSubmitSave)}>
          <UnitFormField form={form} />
        </form>
      </DialogContent>
    </DialogForm>
  );
};

export default UnitUpdateDialog;
