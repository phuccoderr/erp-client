import { DialogContent } from "@components/ui";
import { z } from "zod";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { useEffect } from "react";
import { toast } from "sonner";
import RoleFormField from "./role-form-field.component";
import { DialogForm } from "@components/layouts";
import { useCommandUpdateRole, useFormRole, useQueryRole } from "@apis/roles";

interface RoleUpdateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roleId: number;
}

const RoleUpdateDialog = ({
  roleId,
  isOpen,
  onOpenChange,
}: RoleUpdateDialogProps) => {
  const { data: role } = useQueryRole(roleId);
  const { mutate, isPending } = useCommandUpdateRole();
  const { t } = useLang();
  const { form, schema } = useFormRole();

  const onSubmitSave = (body: z.infer<typeof schema>) => {
    mutate(
      { id: roleId, body },
      {
        onSuccess: () => {
          onOpenChange(false);
          queryClient.invalidateQueries({
            queryKey: [TANSTACK_KEY_CONST.QUERY_ROLE],
          });
          form.reset();
          toast.success(t(LANG_KEY_CONST.COMMON_SAVE_SUCCESS));
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        permission_ids: role.permissions?.map((p) => p.id) || [],
      });
    }
  }, [role]);

  return (
    <DialogForm
      title={t(LANG_KEY_CONST.ROLE_TITLE_UPDATE)}
      submitText={t(LANG_KEY_CONST.COMMON_SAVE)}
      idSubmit="role-update"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isPending={isPending}
    >
      <DialogContent>
        <form id="role-update" onSubmit={form.handleSubmit(onSubmitSave)}>
          <RoleFormField form={form} />
        </form>
      </DialogContent>
    </DialogForm>
  );
};

export default RoleUpdateDialog;
