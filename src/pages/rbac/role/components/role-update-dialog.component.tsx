import { Dialog, DialogContainer } from "@components/ui";
import { z } from "zod";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import {
  useCommandUpdateRole,
  useFormRoleUpdate,
  useQueryRole,
} from "@hooks/role";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { memo, useEffect } from "react";
import { toast } from "sonner";
import RoleForm from "./role-form.component";

interface RoleUpdateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  roleId: number;
}

const RoleUpdateDialog = memo(
  ({ roleId, isOpen, onOpenChange }: RoleUpdateDialogProps) => {
    const { data: role } = useQueryRole(roleId);
    const { mutate, isPending } = useCommandUpdateRole();
    const { t } = useLang();
    const { form, schema } = useFormRoleUpdate();

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
            console.log(err);
          },
        }
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContainer className="sm:max-w-3xl">
          <RoleForm
            form={form}
            onSubmit={onSubmitSave}
            submitText="Save"
            title="Edit"
            isPending={isPending}
          />
        </DialogContainer>
      </Dialog>
    );
  }
);

export default RoleUpdateDialog;
