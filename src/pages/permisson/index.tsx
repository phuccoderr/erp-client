import {
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
import { useQueryPermissions } from "@hooks/permisson/use-query-permission.hook";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { type Permission } from "@types";
import { FileDown, FolderDown } from "lucide-react";

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
          <Button variant="secondary">
            <FileDown />
            <Typography>{LANG_KEY_CONST.EXPORT}</Typography>
          </Button>
          <Button>+ {LANG_KEY_CONST.PERMISSION.BTN_ADD}</Button>
        </div>
      </TanstackTableHeader>
      <TanstackTableContent>
        <TanstackTableFilter />
        <TanstackTableData data={data} columns={columns} />
        <TanstackTableFooter />
      </TanstackTableContent>
    </TanstackTable>
  );
};

export default PermissionPage;
