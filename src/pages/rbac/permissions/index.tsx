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
import {
  createColumnHelper,
  type AccessorKeyColumnDef,
} from "@tanstack/react-table";
import type {
  FindAllPermission,
  Permission,
  PermissionFieldSort,
} from "@types";
import {
  ArrowUpDown,
  CirclePlus,
  Edit3,
  Eye,
  FileSearchCorner,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { FilterUtils } from "@utils";
import { useLang } from "@hooks";
import { LANG_KEY_CONST } from "@constants";
import { PermissionApi, useQueryPermissions } from "@apis/permissions";
import { useFilterTable } from "@hooks/use-filter-table";

const ACTION_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    variant: "soft-red" | "soft-purple" | "soft" | "soft-green";
  }
> = {
  get: { icon: Eye, variant: "soft" },
  post: { icon: CirclePlus, variant: "soft-green" },
  patch: { icon: Edit3, variant: "soft-purple" },
  delete: { icon: Trash2, variant: "soft-red" },
};

const PermissionsPage = () => {
  const { t, data: dataLang } = useLang();
  const { filters, setFilters, query, setQuery } =
    useFilterTable<FindAllPermission>();
  const { data, isFetching, isLoading, refetch } = useQueryPermissions({
    page: query.page,
    take: query.take,
    pagination: query.pagination,
    orderBy: query.orderBy,
    order: query.order,
    resource: query.resource,
  });

  const columnHelper = createColumnHelper<Permission>();
  const columns: AccessorKeyColumnDef<Permission, string>[] = [
    columnHelper.accessor("resource", {
      header: t(LANG_KEY_CONST.PERMISSION_FIELD_RESOURCE),
      enableHiding: false,
    }),
    columnHelper.accessor("action", {
      header: t(LANG_KEY_CONST.PERMISSION_FIELD_ACTION),
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
    columnHelper.accessor("description", {
      header: t(LANG_KEY_CONST.PERMISSION_FIELD_DESCRIPTION),
    }),
    columnHelper.accessor("path", {
      header: t(LANG_KEY_CONST.PERMISSION_FIELD_PATH),
    }),
  ];
  const csvHeaders = columns.map((col) => ({
    label: col.header as string,
    key: col.accessorKey as string,
  }));
  const fieldSorts: Record<PermissionFieldSort, string> = {
    resource: t(LANG_KEY_CONST.PERMISSION_FIELD_RESOURCE),
    description: t(LANG_KEY_CONST.PERMISSION_FIELD_DESCRIPTION),
    path: t(LANG_KEY_CONST.PERMISSION_FIELD_PATH),
    action: t(LANG_KEY_CONST.PERMISSION_FIELD_ACTION),
    created_at: t(LANG_KEY_CONST.COMMON_CREATED_AT),
  };

  const primaryOptions = useMemo(
    () =>
      Object.entries(fieldSorts).map(([value, label]) => ({
        value,
        label,
      })),
    [dataLang],
  );

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handleApplySort = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: filters.orderBy,
      order: filters.order,
    }));
  }, [filters.orderBy, filters.order]);

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
      meta={data?.meta ?? { take: 0, page: 0, total: 0, total_pages: 0 }}
      pinning={["resource"]}
    >
      <TanstackTableHeader
        title={t(LANG_KEY_CONST.PERMISSION)}
        csv={{
          headers: csvHeaders,
          filename: "permissions-2026.csv",

          fetchAllRecords: async () => {
            const res = await PermissionApi.findAll({ pagination: false });
            return res.data.entities;
          },
        }}
      />

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
                query.orderBy,
                query.order,
                fieldSorts,
              ),
              primaryValue: filters.orderBy,
              primaryPlaceholder: t(LANG_KEY_CONST.COMMON_FIELD),
              primaryOptions: primaryOptions,
              onPrimaryChange: (value) => {
                const orderBy = value as keyof Permission;
                setFilters((prev) => ({
                  ...prev,
                  orderBy,
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
                  orderBy: undefined,
                  order: undefined,
                }));
                setQuery((prev) => ({
                  ...prev,
                  orderBy: undefined,
                  order: undefined,
                }));
              },
            },
            {
              type: "input",
              icon: <FileSearchCorner />,
              state: FilterUtils.getSearchState(
                query.resource,
                t(LANG_KEY_CONST.PERMISSION_FIELD_RESOURCE),
              ),
              label: t(LANG_KEY_CONST.PERMISSION_FIELD_RESOURCE),
              value: filters.resource ?? "",
              placeholder: `${t(LANG_KEY_CONST.COMMON_SEARCH)} ${t(
                LANG_KEY_CONST.PERMISSION_FIELD_RESOURCE,
              )}`,
              onChange: (resource) => {
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

export default PermissionsPage;
