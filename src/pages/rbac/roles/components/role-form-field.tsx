import {
  Badge,
  Checkbox,
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
import { useLang } from "@hooks/use-lang";
import { StringUtils } from "@utils";
import { Check, SearchIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { RoleGroup } from "src/types";
import { useQueryPermissions } from "@apis/permissions";

interface RoleFormFieldProps {
  form: any;
}

const RoleFormField = ({ form }: RoleFormFieldProps) => {
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
            g.name.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.children.length > 0);
  }, [searchQuery, permissionsGroup]);

  const allPermissionIds = useMemo(() => {
    return (
      permissions?.entities
        ?.filter((p) => p.resource !== "auth")
        .map((p) => p.id) ?? []
    );
  }, [permissions]);

  const allSelected =
    allPermissionIds.length > 0 &&
    allPermissionIds.every((id) => permissionIds.includes(id));

  const handleSelectAll = () => {
    if (allSelected) {
      // Bỏ chọn hết
      form.setValue("permission_ids", [], { shouldDirty: true });
    } else {
      // Chọn hết tất cả permission (không lọc theo search)
      form.setValue("permission_ids", [...allPermissionIds], {
        shouldDirty: true,
      });
    }
  };

  const isGroupChecked = useCallback(
    (group: RoleGroup) =>
      group.children.every((p) => permissionIds.includes(p.id)),
    [permissionIds],
  );

  const togglePermission = (id: number) => {
    const current = form.getValues("permission_ids") || [];
    form.setValue(
      "permission_ids",
      current.includes(id)
        ? current.filter((x: number) => x !== id)
        : [...current, id],
      { shouldDirty: true },
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
      { shouldDirty: true },
    );
  };
  return (
    <FieldSet>
      <FieldGroup>
        <Input
          isForm
          control={form.control}
          required
          label={t(LANG_KEY_CONST.ROLE_INPUT_NAME_TITLE)}
          name="name"
          placeholder={t(LANG_KEY_CONST.ROLE_INPUT_NAME_PLACEHOLDER)}
        />
        <Textarea
          isForm
          control={form.control}
          required
          label={t(LANG_KEY_CONST.ROLE_INPUT_DESCRIPTION_TITLE)}
          name="description"
          placeholder={t(LANG_KEY_CONST.ROLE_INPUT_DESCRIPTION_PLACEHOLDER)}
        />
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Typography className="font-medium">
              {t(LANG_KEY_CONST.PERMISSION)}
            </Typography>
            <div className="flex items-center gap-2">
              <Checkbox
                className="cursor-pointer"
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                disabled={!permissions || allPermissionIds.length === 0}
              >
                <Check />
              </Checkbox>
              <Badge className="text-[10px]">
                {selectedCount} {t(LANG_KEY_CONST.COMMON_SELECTED)}
              </Badge>
            </div>
          </div>
          <InputGroup>
            <InputGroupInput
              placeholder={`${t(LANG_KEY_CONST.COMMON_SEARCH)}...`}
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
                    className="flex items-center gap-2 p-1 hover:bg-outline rounded-lg cursor-pointer"
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
                          className="flex items-center gap-2 hover:bg-outline p-1 rounded-lg cursor-pointer"
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
  );
};

export default RoleFormField;
