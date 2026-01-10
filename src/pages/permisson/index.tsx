import {
  Badge,
  Button,
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  TanstackTableFilter,
  TanstackTableFooter,
  TanstackTableHeader,
  Typography,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { useQueryPermissions } from "@hooks/permisson";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
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
  FileDown,
  FileSearchCorner,
  Trash2,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FormCreatePermission } from "./components";
import { FilterUtils } from "@utils";

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
  const [filters, setFilters] = useState<FindAllPermission>({
    page: 1,
    limit: 10,
    pagination: false,
    order: undefined,
    sort: undefined,
  });
  const [query, setQuery] = useState<FindAllPermission>({
    page: 1,
    limit: 10,
    pagination: false,
    sort: undefined,
    order: undefined,
  });
  const { data, isFetching, refetch } = useQueryPermissions({
    page: query.page,
    limit: query.limit,
    pagination: query.pagination,
    sort: query.sort,
    order: query.order,
    resource: query.resource,
  });

  const columns = useMemo<ColumnDef<Permission, any>[]>(() => {
    const columnHelper = createColumnHelper<Permission>();

    return [
      columnHelper.accessor("resource", {
        header: "Tài nguyên",
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
  }, []);

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
      <TanstackTableHeader title="Permission">
        <div className="flex gap-2">
          <Button variant="secondary">
            <FileDown />
            <Typography>{LANG_KEY_CONST.EXPORT}</Typography>
          </Button>
          <FormCreatePermission />
        </div>
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
              label: "Sắp xếp",
              state: FilterUtils.getSortState(
                query.sort,
                query.order,
                fieldSorts
              ),
              primaryValue: filters.sort,
              primaryPlaceholder: "thuộc tính",
              primaryOptions: primaryOptions,
              onPrimaryChange: (value) => {
                const sortBy = value as keyof Permission;
                setFilters((prev) => ({
                  ...prev,
                  sort: sortBy,
                }));
              },
              secondaryValue: filters.order,
              secondaryPlaceholder: "Thứ tự",
              secondaryOptions: [
                { value: "asc", label: "tăng dần" },
                { value: "desc", label: "giảm dần" },
              ],
              onSecondaryChange: (value) => {
                const order = value === "desc" ? "desc" : "asc";
                setFilters((prev) => ({
                  ...prev,
                  order,
                }));
              },
              onApply: handleApplySort,
            },
            {
              type: "input",
              icon: <FileSearchCorner />,
              key: "resource",
              state: FilterUtils.getSearchState(query.resource, "tài nguyên"),
              label: "Tài nguyên",
              value: filters.resource ?? "",
              placeholder: "tìm kiếm tài nguyên...",
              onChange: (resource) =>
                setFilters((prev) => ({ ...prev, resource })),
              onApply: handleApplyResource,
            },
          ]}
        />
        <TanstackTableData />
        <TanstackTableFooter onPageChange={handlePageChange} />
      </TanstackTableContent>
    </TanstackTable>
  );
};

export default PermissionPage;
