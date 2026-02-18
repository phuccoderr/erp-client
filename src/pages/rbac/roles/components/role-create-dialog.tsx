import { DialogContent } from "@components/ui";
import { z } from "zod";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { toast } from "sonner";
import RoleFormField from "./role-form-field";
import { DialogForm } from "@components/layouts";
import { useCommandCreateRole, useFormRole } from "@apis/roles";

interface RoleCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const RoleCreateDialog = ({ isOpen, onOpenChange }: RoleCreateDialogProps) => {
  const { mutate, isPending } = useCommandCreateRole();
  const { t } = useLang();
  const { form, schema } = useFormRole();

  const onSubmitSave = (body: z.infer<typeof schema>) => {
    mutate(body, {
      onSuccess: () => {
        onOpenChange(false);
        queryClient.invalidateQueries({
          queryKey: [TANSTACK_KEY_CONST.QUERY_ROLE],
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
      title={t(LANG_KEY_CONST.ROLE_TITLE_ADD)}
      submitText={t(LANG_KEY_CONST.COMMON_CREATE)}
      idSubmit="role-create"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isPending={isPending}
    >
      <DialogContent>
        <form id="role-create" onSubmit={form.handleSubmit(onSubmitSave)}>
          <RoleFormField form={form} />
        </form>
      </DialogContent>
    </DialogForm>
  );
};

export default RoleCreateDialog;
