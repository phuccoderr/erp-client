import { Dialog, DialogContainer } from "@components/ui";
import { z } from "zod";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useCommandCreateRole, useFormRoleCreate } from "@hooks/role";
import { useLang } from "@hooks/use-lang";
import { queryClient } from "@utils";
import { memo } from "react";
import { toast } from "sonner";
import RoleForm from "./role-form.component";

interface RoleCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const RoleCreateDialog = memo(
  ({ isOpen, onOpenChange }: RoleCreateDialogProps) => {
    const { mutate, isPending } = useCommandCreateRole();
    const { t } = useLang();
    const { form, schema } = useFormRoleCreate();

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
          console.log(err);
        },
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContainer className="sm:max-w-3xl">
          <RoleForm
            form={form}
            onSubmit={onSubmitSave}
            submitText="Create"
            title="ADd"
            isPending={isPending}
          />
        </DialogContainer>
      </Dialog>
    );
  }
);

export default RoleCreateDialog;
