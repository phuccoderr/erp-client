import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Typography,
} from "@components/ui";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { queryClient, StringUtils } from "@utils";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import RoleUpdateDialog from "./components/role-update-dialog.component";
import RoleCreateDialog from "./components/role-create-dialog.component";
import { AlertDialogDelete } from "@components/ui";
import { toast } from "sonner";
import { useCommandDeleteRole, useQueryRoles } from "@apis/roles";
import type { RoleGroup } from "@types";

const RolesPage = () => {
  const { t } = useLang();
  const { data } = useQueryRoles({ pagination: false });
  const [roleId, setRoleId] = useState(0);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { mutate: mutateDeleteRole } = useCommandDeleteRole();

  const toggleOpenUpdate = (roleId: number) => {
    setRoleId(roleId);
    setOpenUpdate(true);
  };

  const toggleOpenCreate = () => {
    setOpenCreate(true);
  };

  const toggleOpenDelete = (roleId: number) => {
    setRoleId(roleId);
    setOpenDelete(true);
  };

  const toggleActionDelete = () => {
    mutateDeleteRole(roleId, {
      onSuccess: () => {
        setRoleId(0);
        queryClient.invalidateQueries({
          queryKey: [TANSTACK_KEY_CONST.QUERY_ROLE],
        });
        toast.success(LANG_KEY_CONST.COMMON_DELETE_SUCCESS);
        setOpenDelete(false);
      },
    });
  };

  const getRoleGroups = useCallback((role: any) => {
    const resourceMap = new Map<string, RoleGroup>();

    role.permissions.forEach((permission: any) => {
      const { resource } = permission;

      if (!resourceMap.has(resource)) {
        resourceMap.set(resource, {
          name: resource,
          children: [],
        });
      }

      const group = resourceMap.get(resource)!;
      if (!group.children.some((p) => p.id === permission.id)) {
        group.children.push(permission);
      }
    });

    return Array.from(resourceMap.values());
  }, []);

  return (
    <>
      <div className="flex justify-between items-center py-2">
        <Typography variant="h4" className="flex-1">
          {t(LANG_KEY_CONST.MENU_RBAC_ROLE)}
        </Typography>
        <div className="flex items-end">
          <Button onClick={toggleOpenCreate}>
            {t(LANG_KEY_CONST.ROLE_BTN_ADD)}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {data?.entities.map((role) => (
          <Card
            key={role.id}
            className="w-full sm:max-w-sm sm:col-span-1 col-span-4"
          >
            <CardHeader>
              <CardTitle>{StringUtils.capitalize(role.name)}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
              <CardAction>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleOpenUpdate(role.id)}
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-outline-red hover:text-outline-red-foreground"
                  onClick={() => toggleOpenDelete(role.id)}
                >
                  <Trash2 />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Typography className="font-medium mb-2">
                {StringUtils.capitalize(t(LANG_KEY_CONST.PERMISSION))} (
                {getRoleGroups(role).length})
              </Typography>
              <div className="flex flex-col gap-1">
                {getRoleGroups(role)
                  .slice(0, 4)
                  .map((role) => {
                    const methodString = role.children
                      .map((item) => item.action)
                      .join(", ");

                    return (
                      <Badge
                        key={role.name}
                        className="rounded-sm"
                        variant="soft"
                      >
                        {role.name}: {methodString}
                      </Badge>
                    );
                  })}

                {getRoleGroups(role).length > 4 && (
                  <Badge className="rounded-sm" variant="soft">
                    {t(LANG_KEY_CONST.COMMON_MORE)}{" "}
                    {getRoleGroups(role).length - 4}+
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <RoleUpdateDialog
        isOpen={openUpdate}
        onOpenChange={setOpenUpdate}
        roleId={roleId}
      />
      <RoleCreateDialog isOpen={openCreate} onOpenChange={setOpenCreate} />
      <AlertDialogDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        toggleDelete={toggleActionDelete}
      />
    </>
  );
};

export default RolesPage;
