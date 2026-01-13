import {
  Badge,
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  TanstackTableFilter,
  TanstackTableFooter,
  TanstackTableHeader,
  TanstackTableHeaderRight,
} from "@components/ui";
import { useQueryPermissions } from "@hooks/permisson";
import {
  createColumnHelper,
  type AccessorKeyColumnDef,
} from "@tanstack/react-table";
import {
  type FindAllPermission,
  type Permission,
  type PermissionFieldSort,
} from "@types";
import {
  ArrowUpDown,
  CirclePlus,
  Edit3,
  Eye,
  FileSearchCorner,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FilterUtils } from "@utils";
import { useLang } from "@hooks/use-lang";
import { LANG_KEY_CONST } from "@constants";

const ACTION_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    variant: "outline_red" | "outline_purple" | "outline" | "outline_green";
  }
> = {
  get: { icon: Eye, variant: "outline" },
  post: { icon: CirclePlus, variant: "outline_green" },
  patch: { icon: Edit3, variant: "outline_purple" },
  delete: { icon: Trash2, variant: "outline_red" },
};

const fieldSorts: Record<PermissionFieldSort, string> = {
  resource: "Resource",
  description: "Mô tả",
  path: "Đường dẫn",
  action: "Hành động",
  created_at: "Ngày tạo",
};

const PermissionPage = () => {
  const { t } = useLang();
  const [filters, setFilters] = useState<FindAllPermission>({
    page: 1,
    limit: 15,
    pagination: true,
    order: undefined,
    sort: undefined,
  });
  const [query, setQuery] = useState<FindAllPermission>({
    page: 1,
    limit: 15,
    pagination: true,
    sort: undefined,
    order: undefined,
  });
  const { data, isFetching, isLoading, refetch } = useQueryPermissions({
    page: query.page,
    limit: query.limit,
    pagination: query.pagination,
    sort: query.sort,
    order: query.order,
    resource: query.resource,
  });

  const columnHelper = createColumnHelper<Permission>();
  const columns: AccessorKeyColumnDef<Permission, string>[] = [
    columnHelper.accessor("resource", {
      header: t(LANG_KEY_CONST.PERMISSION_TABLE_HEADER_RESOURCE),
      size: 50,
      enableHiding: false,
    }),
    columnHelper.accessor("action", {
      header: "Hành động",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        const config = ACTION_CONFIG[value] ?? ACTION_CONFIG.get;

        const Icon = config.icon;

        return (
          <Badge variant={config.variant} className="rounded-sm">
            <Icon className="h-3.5 w-3.5 mr-1" />
            {value}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("description", { header: "Mô tả" }),
    columnHelper.accessor("path", { header: "Đường dẫn" }),
  ];
  const headers = columns.map((col) => ({
    label: col.header as string,
    key: col.accessorKey as string,
  }));

  const primaryOptions = useMemo(
    () =>
      Object.entries(fieldSorts).map(([value, label]) => ({
        value,
        label,
      })),
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handleApplySort = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      sort: filters.sort,
      order: filters.order,
    }));
  }, [filters.sort, filters.order]);

  const handleApplyResource = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      resource: filters.resource,
    }));
  }, [filters.resource]);

  return (
    <TanstackTable
      data={data?.entities ?? []}
      columns={columns}
      isPagination={query.pagination}
      meta={data?.meta ?? { limit: 0, page: 0, total: 0, total_pages: 0 }}
      pinning={["resource"]}
    >
      <TanstackTableHeader title={t(LANG_KEY_CONST.PERMISSION)}>
        <TanstackTableHeaderRight
          csv={{ data: data?.entities ?? [], headers: headers }}
        />
      </TanstackTableHeader>
      <TanstackTableContent>
        <TanstackTableFilter
          isFetching={isFetching}
          onRefresh={refetch}
          // Filter
          filters={[
            {
              type: "two-select",
              icon: <ArrowUpDown />,
              label: t(LANG_KEY_CONST.COMMON_SORT),
              state: FilterUtils.getSortState(
                query.sort,
                query.order,
                fieldSorts
              ),
              primaryValue: filters.sort,
              primaryPlaceholder: `${t(LANG_KEY_CONST.COMMON_SEARCH)} ${t(
                LANG_KEY_CONST.PERMISSION_TABLE_HEADER_RESOURCE
              )}`,
              primaryOptions: primaryOptions,
              onPrimaryChange: (value) => {
                const sortBy = value as keyof Permission;
                setFilters((prev) => ({
                  ...prev,
                  sort: sortBy,
                }));
              },
              secondaryValue: filters.order,
              secondaryPlaceholder: t(LANG_KEY_CONST.COMMON_ORDER),
              secondaryOptions: [
                { value: "asc", label: t(LANG_KEY_CONST.COMMON_ASC) },
                { value: "desc", label: t(LANG_KEY_CONST.COMMON_DESC) },
              ],
              onSecondaryChange: (value) => {
                const order = value === "desc" ? "desc" : "asc";
                setFilters((prev) => ({
                  ...prev,
                  order,
                }));
              },
              onApply: handleApplySort,
              onClear: () => {
                setFilters((prev) => ({
                  ...prev,
                  sort: undefined,
                  order: undefined,
                }));
                setQuery((prev) => ({
                  ...prev,
                  sort: undefined,
                  order: undefined,
                }));
              },
            },
            {
              type: "input",
              icon: <FileSearchCorner />,
              key: "resource",
              state: FilterUtils.getSearchState(query.resource, "tài nguyên"),
              label: "Tài nguyên",
              value: filters.resource ?? "",
              placeholder: "tìm kiếm tài nguyên...",
              onChange: (resource) => {
                console.log("comn", resource);
                setFilters((prev) => ({ ...prev, resource }));
              },
              onApply: handleApplyResource,
              onClear: () => {
                setFilters((prev) => ({
                  ...prev,
                  resource: undefined,
                }));
                setQuery((prev) => ({
                  ...prev,
                  resource: undefined,
                }));
              },
            },
          ]}
        />
        <TanstackTableData isLoading={isLoading} />
        <TanstackTableFooter onPageChange={handlePageChange} />
      </TanstackTableContent>
    </TanstackTable>
  );
};

export default PermissionPage;
