import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTanstackTable,
} from "@components/ui";
import { Grid2x2 } from "lucide-react";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { type FilterItem, WrapperFilter } from "@components/layouts";

interface ManageColumnItem {
  id: string;
  isVisible: boolean;
  canHide: boolean;
  onChecked: (checked: boolean) => void;
  label: string;
}

interface TanstackTableFilterProps {
  // Props Filter
  filters?: FilterItem[];
  // Props Refresh
  onRefresh?: () => void;
  isFetching: boolean;
}

const TanstackTableFilter = ({
  filters = [],
  onRefresh,
  isFetching = false,
}: TanstackTableFilterProps) => {
  const { getAllColumns, getAllLeafColumns } = useTanstackTable();
  const { t } = useLang();

  const manageColumns: ManageColumnItem[] = getAllLeafColumns().map(
    (column) => ({
      id: column.id,
      isVisible: column.getIsVisible(),
      canHide: column.getCanHide(),
      onChecked: (checked) => {
        column.toggleVisibility(!!checked);
      },
      label:
        (column.columnDef.header as string) ?? column.id.replace(/_/g, " "),
    }),
  );

  const checkedAll = getAllColumns().every((column) => column.getIsVisible());
  const handleCheckAll = (checked: boolean) => {
    getAllLeafColumns().forEach((column) => {
      if (column.getCanHide() !== false) {
        column.toggleVisibility(!!checked);
      }
    });
  };

  return (
    <WrapperFilter
      filters={filters}
      isFetching={isFetching}
      onRefresh={onRefresh}
    >
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="outline">
                <Grid2x2 />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {t(LANG_KEY_CONST.COMMON_TOOLTIP_MANAGE_COLUMN)}
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            onSelect={(e) => e.preventDefault()}
            checked={checkedAll}
            onCheckedChange={(checked) => handleCheckAll(checked)}
            className={`${
              checkedAll ? "focus:bg-outline" : "focus:bg-transparent"
            } focus:text-primary text-xs`}
          >
            {t(LANG_KEY_CONST.COMMON_BTN_SELECT_ALL)}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />

          {manageColumns?.map((column) => (
            <DropdownMenuCheckboxItem
              className={`${
                column.isVisible ? "focus:bg-outline" : "focus:bg-transparent"
              } focus:text-primary text-xs`}
              key={`${column.id}-${column.isVisible}`}
              disabled={!column.canHide}
              checked={column.isVisible}
              onCheckedChange={column.onChecked}
              onSelect={(e) => e.preventDefault()}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </WrapperFilter>
  );
};

export { TanstackTableFilter };
