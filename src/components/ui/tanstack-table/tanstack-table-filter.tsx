import {
  cloneElement,
  isValidElement,
  useCallback,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
  useTanstackTable,
} from "@components/ui";
import {
  Ban,
  FunnelPlus,
  Grid2x2,
  RefreshCw,
  SearchCheck,
  X,
} from "lucide-react";
import { LANG_KEY_CONST } from "@constants";
import { ButtonAnimated } from "@components/animations";
import { motion } from "motion/react";

interface ManageColumnItem {
  id: string;
  isVisible: boolean;
  canHide: boolean;
  onChecked: (checked: boolean) => void;
  label: string;
}

interface SortOption {
  value: string;
  label: string;
}

export interface FilterItem {
  // base
  type: "two-select" | "select" | "input" | "custom";
  label: string;
  state?: string | null;
  key?: string;
  onApply?: () => void;
  onClear?: (key: string) => void;
  render?: () => ReactNode;
  icon?: ReactElement;
  hasCanApply?: boolean;
  // Props type input or select
  value?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  // Props type two select
  primaryKey?: string;
  primaryValue?: string;
  primaryPlaceholder?: string;
  primaryOptions?: SortOption[];
  onPrimaryChange?: (value: string) => void;
  secondaryKey?: string;
  secondaryValue?: string;
  secondaryPlaceholder?: string;
  secondaryOptions?: SortOption[];
  onSecondaryChange?: (value: string) => void;
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
    })
  );

  const checkedAll = getAllColumns().every((column) => column.getIsVisible());
  const handleCheckAll = (checked: boolean) => {
    getAllLeafColumns().forEach((column) => {
      if (column.getCanHide() !== false) {
        column.toggleVisibility(!!checked);
      }
    });
  };
  const hasFilters = filters.length > 0;

  const renderActiveFilterBadges = useCallback(() => {
    return filters
      .filter((item) => item.state)
      .map((item) => (
        <motion.div
          key={item.key ?? item.label}
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.94, transition: { duration: 0.2 } }}
          className="cursor-pointer inline-block"
        >
          <Badge variant="outline">
            {item.state}
            <Button
              size="icon-xs"
              variant="ghost"
              className=" transition-colors rounded-full hover:text-current"
            >
              <X />
            </Button>
          </Badge>
        </motion.div>
      ));
  }, [filters]);
  return (
    <div className="border-b flex justify-between items-center py-2 px-4">
      <div className="py-4 px-2 flex items-center gap-1.5 flex-wrap">
        {renderActiveFilterBadges()}
      </div>
      <div className="flex gap-2 items-center">
        {/* Filter */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button size="icon-sm" variant="outline">
                  <FunnelPlus />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <Typography>{LANG_KEY_CONST.TOOLTIP_FILTER}</Typography>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{LANG_KEY_CONST.FILTER}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hasFilters &&
              filters.map((filter) => (
                <DropdownMenuSub key={filter.label}>
                  <DropdownMenuSubTrigger iconAlign="none">
                    {filter.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent sideOffset={4}>
                      <div className="flex flex-col gap-2 px-1.5 py-2">
                        <div className="flex items-center gap-2 mr-auto">
                          {isValidElement(filter.icon)
                            ? cloneElement(
                                filter.icon as React.ReactElement<any>,
                                {
                                  className: "w-4 h-4 text-muted-foreground",
                                }
                              )
                            : filter.icon}
                          <Typography className="font-medium">
                            {filter.label}
                          </Typography>
                        </div>
                        {filter.type === "two-select" && (
                          <div className="w-full flex justify-between items-center gap-1.5">
                            <Select
                              value={filter.primaryValue ?? ""}
                              onValueChange={(value) =>
                                filter.onPrimaryChange?.(value)
                              }
                            >
                              <SelectTrigger size="sm" className="flex-1">
                                <SelectValue
                                  placeholder={filter.primaryPlaceholder}
                                />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                {filter.primaryOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={filter.secondaryValue ?? ""}
                              onValueChange={(value) =>
                                filter.onSecondaryChange?.(value)
                              }
                            >
                              <SelectTrigger size="sm" className="flex-1">
                                <SelectValue
                                  placeholder={filter.secondaryPlaceholder}
                                />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                {filter.secondaryOptions?.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {filter.type === "input" && (
                          <div onSelect={(e) => e.preventDefault()}>
                            <Input
                              placeholder={filter.placeholder}
                              value={filter.value}
                              onChange={(e) =>
                                filter.onChange?.(e.target.value)
                              }
                            />
                          </div>
                        )}

                        {filter.type === "select" && filter.options && (
                          <DropdownMenuItem>
                            <Select
                              value={filter.value ?? ""}
                              onValueChange={filter.onChange}
                            >
                              <SelectTrigger size="sm">
                                <SelectValue
                                  placeholder={filter.placeholder ?? "Chọn..."}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {filter.options.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </DropdownMenuItem>
                        )}
                      </div>

                      <div className="flex justify-end items-center gap-2 px-1.5 py-2">
                        <Button variant={"outline"}>
                          <Ban /> Cancel
                        </Button>
                        <Button
                          disabled={filter.hasCanApply}
                          onClick={() => filter.onApply?.()}
                        >
                          <SearchCheck className="text-current" />
                          Apply Filter
                        </Button>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>

                  {filter.type === "custom" && filter.render?.()}
                </DropdownMenuSub>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Refresh */}
        <Tooltip>
          <TooltipTrigger asChild>
            <ButtonAnimated
              size="icon-sm"
              variant="outline"
              onClick={() => onRefresh?.()}
              disabled={isFetching}
            >
              <RefreshCw />
            </ButtonAnimated>
          </TooltipTrigger>
          <TooltipContent>
            <Typography>{LANG_KEY_CONST.TOOLTIP_REFRESH}</Typography>
          </TooltipContent>
        </Tooltip>
        {/* Manage Column */}
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
              {LANG_KEY_CONST.TOOLTIP_MANAGE_COLUMN}
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
              {LANG_KEY_CONST.SELECT_ALL}
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
      </div>
    </div>
  );
};

export { TanstackTableFilter };
