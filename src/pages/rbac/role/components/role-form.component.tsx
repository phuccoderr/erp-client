import { ButtonAnimated } from "@components/animations";
import {
  Badge,
  Button,
  Checkbox,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldGroup,
  FieldSet,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  ScrollArea,
  Textarea,
  Typography,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { useQueryPermissions } from "@hooks/permisson";
import { useLang } from "@hooks/use-lang";
import type { RoleGroup } from "@types";
import { StringUtils } from "@utils";
import { Ban, CheckCheck, SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface RoleFormProps {
  title: string;
  submitText: string;
  form: any;
  isPending?: boolean;
  onSubmit: (body: any) => void;
}

const RoleForm = ({
  form,
  onSubmit,
  isPending,
  title,
  submitText,
}: RoleFormProps) => {
  const { data: permissions } = useQueryPermissions({ pagination: false });
  const { t } = useLang();
  const [searchQuery, setSearchQuery] = useState("");

  const permissionIds = form.watch("permission_ids") || [];

  const selectedCount = useMemo(() => permissionIds.length, [permissionIds]);

  const permissionsGroup = useMemo<RoleGroup[]>(() => {
    if (!permissions) return [];

    const map = new Map<string, RoleGroup>();

    permissions.entities.forEach((p) => {
      if (p.resource === "auth") return;

      if (!map.has(p.resource)) {
        map.set(p.resource, { name: p.resource, children: [] });
      }
      map.get(p.resource)!.children.push(p);
    });

    return Array.from(map.values());
  }, [permissions]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return permissionsGroup;

    const q = searchQuery.toLowerCase();
    return permissionsGroup
      .map((g) => ({
        ...g,
        children: g.children.filter(
          (p) =>
            p.action.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            g.name.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.children.length > 0);
  }, [searchQuery, permissionsGroup]);

  const isGroupChecked = useCallback(
    (group: RoleGroup) =>
      group.children.every((p) => permissionIds.includes(p.id)),
    [permissionIds]
  );

  const togglePermission = (id: number) => {
    const current = form.getValues("permission_ids") || [];
    form.setValue(
      "permission_ids",
      current.includes(id)
        ? current.filter((x: number) => x !== id)
        : [...current, id],
      { shouldDirty: true }
    );
  };

  const toggleGroup = (group: RoleGroup) => {
    const current = form.getValues("permission_ids") || [];
    const ids = group.children.map((p) => p.id);

    form.setValue(
      "permission_ids",
      isGroupChecked(group)
        ? current.filter((id: number) => !ids.includes(id))
        : [...new Set([...current, ...ids])],
      { shouldDirty: true }
    );
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent className="flex flex-col gap-2">
        <FieldSet>
          <FieldGroup>
            <Input
              isForm
              control={form.control}
              label={t(LANG_KEY_CONST.ROLE_INPUT_NAME_TITLE)}
              name="name"
              placeholder={t(LANG_KEY_CONST.ROLE_INPUT_NAME_PLACEHOLDER)}
            />
            <Textarea
              isForm
              control={form.control}
              label={t(LANG_KEY_CONST.ROLE_INPUT_DESCRIPTION_TITLE)}
              name="description"
              placeholder={t(LANG_KEY_CONST.ROLE_INPUT_DESCRIPTION_PLACEHOLDER)}
            />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Typography className="font-medium">
                  {t(LANG_KEY_CONST.PERMISSION)}
                </Typography>
                <Badge className="text-[10px]">{selectedCount} selected</Badge>
              </div>
              <InputGroup>
                <InputGroupInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
              </InputGroup>
              <ScrollArea className="border h-64 rounded-sm">
                <div className="flex flex-col gap-2 p-2">
                  {filteredGroups?.map((group) => (
                    <div key={group.name} className="flex flex-col gap-2">
                      <div
                        className="flex items-center gap-2 p-1 hover:bg-outline rounded-lg"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;

                          if (target.closest("input")) {
                            return;
                          }
                          toggleGroup(group);
                        }}
                      >
                        <Checkbox checked={isGroupChecked(group)} />
                        <Label>{StringUtils.capitalize(group.name)}</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-1 ml-4 ">
                        {group.children.map((child) => {
                          const isChecked = permissionIds.includes(child.id);

                          return (
                            <div
                              key={child.id}
                              className="flex items-center gap-2 hover:bg-outline p-1 rounded-lg"
                              onClick={(e) => {
                                const target = e.target as HTMLElement;

                                if (target.closest("input")) {
                                  return;
                                }
                                togglePermission(child.id);
                              }}
                            >
                              <Checkbox checked={isChecked} />
                              <div>
                                <Typography>{child.action}</Typography>
                                <Typography variant="muted">
                                  {child.description}
                                </Typography>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </FieldGroup>
        </FieldSet>
      </DialogContent>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"outline"}>
            <Ban /> {t(LANG_KEY_CONST.COMMON_CANCEL)}
          </Button>
        </DialogClose>
        <ButtonAnimated type="submit" disabled={isPending}>
          <CheckCheck className="text-current" />
          {submitText}
        </ButtonAnimated>
      </DialogFooter>
    </form>
  );
};

export default RoleForm;
