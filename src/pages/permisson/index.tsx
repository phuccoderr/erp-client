import {
  Badge,
  Button,
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  TanstackTableHeader,
  Typography,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { useQueryPermissions } from "@hooks/permisson/use-query-permission.hook";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Permission } from "@types";
import { CirclePlus, Edit3, Eye, FileDown, Trash2 } from "lucide-react";
import { useState } from "react";
import FormCreatePermission from "./components/form-create-permission.component";

const PermissionPage = () => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    pagination: false,
  });
  const { data, refetch } = useQueryPermissions({
    page: query.page,
    limit: query.limit,
    pagination: query.pagination,
    sort: "resource",
  });

  const columnHelper = createColumnHelper<Permission>();
  const columns: ColumnDef<Permission, any>[] = [
    columnHelper.display({
      id: "stt",
      header: "STT",
      size: 50,
      cell: ({ row }) => {
        if (query.pagination && data?.meta) {
          const stt = (data?.meta.page - 1) * data.meta.limit + row.index + 1;
          return <Typography>{stt}</Typography>;
        }
        return <Typography>{row.index + 1}</Typography>;
      },
    }),
    columnHelper.accessor("resource", {
      header: "Tài nguyên",
      size: 50,
      enableHiding: false,
    }),
    columnHelper.accessor("action", {
      header: "Hành động",
      cell: ({ getValue }) => {
        const ACTION_CONFIG: Record<
          string,
          {
            icon: React.ElementType;
            variant:
              | "outline_red"
              | "outline_purple"
              | "outline"
              | "outline_green";
          }
        > = {
          get: { icon: Eye, variant: "outline" },
          post: { icon: CirclePlus, variant: "outline_green" },
          patch: { icon: Edit3, variant: "outline_purple" },
          delete: { icon: Trash2, variant: "outline_red" },
        };

        const config = ACTION_CONFIG[getValue()] ?? ACTION_CONFIG.get; // fallback an toàn về GET

        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="rounded-sm">
            <Icon />
            {getValue()}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("description", { header: "Mô tả" }),
    columnHelper.accessor("path", { header: "Đường dẫn" }),
  ];

  return (
    <TanstackTable>
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
        <TanstackTableData
          data={data?.entities ?? []}
          columns={columns}
          is_pagination={query.pagination}
          meta={data?.meta ?? { limit: 0, page: 0, total: 0, total_pages: 0 }}
          onPageChange={(page) => {
            setQuery((prev) => ({ ...prev, page }));
          }}
          pinning={["stt", "resource"]}
          onRefresh={refetch}
        />
      </TanstackTableContent>
    </TanstackTable>
  );
};

export default PermissionPage;
