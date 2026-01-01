import {
  Button,
  TanstackTable,
  TanstackTableContent,
  TanstackTableHeader,
} from "@components/ui";
import { useQueryPermissions } from "@hooks/permisson/use-query-permission.hook";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Permission } from "@types";
import { FolderDown } from "lucide-react";

const PermissionPage = () => {
  const { data = [] } = useQueryPermissions({
    pagination: false,
  });
  const columnHelper = createColumnHelper<Permission>();
  const columns: ColumnDef<Permission, any>[] = [
    columnHelper.accessor("name", { header: "Tên vai trò" }),
    columnHelper.accessor("description", { header: "Mô tả" }),
    columnHelper.accessor("api_end_points", { header: "Không biết" }),
  ];

  return (
    <TanstackTable>
      <TanstackTableHeader title="Permission">
        <div className="flex gap-2">
          <Button size="icon" variant="secondary">
            <FolderDown />
          </Button>
          <Button>+ Add Permission</Button>
        </div>
      </TanstackTableHeader>
      <TanstackTableContent data={data} columns={columns} />
    </TanstackTable>
  );
};

export default PermissionPage;
