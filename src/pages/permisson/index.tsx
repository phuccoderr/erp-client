import {
  Badge,
  Button,
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  TanstackTableFilter,
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
    limit: 15,
    pagination: true,
  });
  const { data } = useQueryPermissions({
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
      cell: ({ row }) => {
        if (query.pagination && data?.meta) {
          const stt = (data?.meta.page - 1) * data.meta.limit + row.index + 1;
          return <Typography>{stt}</Typography>;
        }
        return <Typography>{row.index + 1}</Typography>;
      },
    }),
    columnHelper.accessor("resource", { header: "Tài nguyên" }),
    columnHelper.accessor("action", {
      header: "Hành động",
      cell: ({ getValue }) => {
        const ACTION_CONFIG: Record<
          string,
          {
            icon: React.ElementType;
            variant:
              | "default"
              | "green"
              | "purple"
              | "destructive"
              | "secondary"
              | "outline";
          }
        > = {
          get: { icon: Eye, variant: "default" },
          post: { icon: CirclePlus, variant: "green" },
          patch: { icon: Edit3, variant: "purple" },
          delete: { icon: Trash2, variant: "destructive" },
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
        <TanstackTableFilter />
        <TanstackTableData
          data={data?.entities ?? []}
          columns={columns}
          is_pagination={query.pagination}
          meta={data?.meta ?? { limit: 0, page: 0, total: 0, total_pages: 0 }}
          onPageChange={(page) => {
            console.log(page);
            setQuery((prev) => ({ ...prev, page }));
          }}
        />
      </TanstackTableContent>
    </TanstackTable>
  );
};

export default PermissionPage;
