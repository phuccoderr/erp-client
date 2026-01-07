import { useState, type ReactNode } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
} from "@components/ui";
import {
  ArrowUpDown,
  Eraser,
  FunnelPlus,
  Grid2x2,
  RefreshCw,
  SearchCheck,
} from "lucide-react";
import { LANG_KEY_CONST } from "@constants";
import { ButtonAnimated } from "@components/animations";

type Order = "asc" | "desc" | undefined;

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterItem {
  type: "select" | "input" | "custom";
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  onApply?: () => void;
  render?: () => ReactNode;
}

export interface ManageColumnItem {
  id: string;
  isVisible: boolean;
  canHide: boolean;
  onChecked: (checked: boolean) => void;
  label: string;
}

interface TanstackTableFilterProps {
  // Props Filter
  sortOptions?: SortOption[];
  filters?: FilterItem[];
  onClear?: () => void;
  onApplySort?: (sortField: { sortBy: string; order: string }) => void;
  order?: Order;
  // Props Manage Column
  checkedAll?: boolean;
  onCheckedAll?: (checked: boolean) => void;
  columns?: ManageColumnItem[];
  // Props Refresh
  onRefresh?: () => void;
  isFetching: boolean;
}

const TanstackTableFilter = ({
  // PropsFiler
  sortOptions = [],
  filters = [],
  onClear,
  onApplySort,
  // Props Manage Column
  checkedAll,
  onCheckedAll,
  columns,
  onRefresh,
  isFetching = false,
}: TanstackTableFilterProps) => {
  const [sortField, setSortField] = useState<{
    sortBy?: string;
    order?: string;
  }>({
    sortBy: undefined,
    order: undefined,
  });
  const handleSortByChange = (sortBy: string) => {
    setSortField((prev) => ({ ...prev, sortBy }));
  };

  const handleOrderChange = (order: string) => {
    setSortField((prev) => ({ ...prev, order }));
  };

  const handleClear = () => {
    onClear?.();
  };

  const handleApplySort = () => {
    if (sortField.sortBy && sortField.order) {
      onApplySort?.({
        sortBy: sortField.sortBy,
        order: sortField.order,
      });
    }
  };

  const renderListSorts = () => {
    if (sortOptions.length > 0) {
      return sortOptions.map((item) => (
        <SelectItem value={item.value}>{item.label}</SelectItem>
      ));
    }

    return null;
  };

  const hasFilters = filters.length > 0;
  const hasApplyFilter = sortField.sortBy && sortField.order ? true : false;

  return (
    <div className="border-b flex justify-between items-center py-2 px-4">
      {/* <InputGroup variant="outline" className="w-[20%] p-0 shadow-none">
          <InputGroupInput
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            placeholder="Search..."
          />
          <InputGroupAddon className="p-0">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup> */}
      <div className="w-[70%]">
        <ScrollArea className="h-30 flex flex-wrap gap-2">
          {Array(50)
            .fill(null)
            .map((_, index) => (
              <Badge variant={"outline"} key={index}>
                Hello {index + 1}
              </Badge>
            ))}
        </ScrollArea>
      </div>
      <div className="flex gap-2 items-center">
        {/* Refresh */}
        <Tooltip>
          <TooltipTrigger>
            <ButtonAnimated
              size="icon-sm"
              variant="outline"
              onClick={() => onRefresh?.()}
              status={isFetching ? "processing" : "default"}
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
          <DropdownMenuTrigger>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline">
                  <Grid2x2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {LANG_KEY_CONST.TOOLTIP_MANAGE_COLUMN}
              </TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              onSelect={(e) => e.preventDefault()}
              checked={checkedAll}
              onCheckedChange={onCheckedAll}
              className={`${
                checkedAll ? "focus:bg-outline" : "focus:bg-transparent"
              } focus:text-primary text-xs`}
            >
              {LANG_KEY_CONST.SELECT_ALL}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />

            {columns?.map((column) => (
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
        {/* Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon-sm" variant="outline">
                  <FunnelPlus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Typography>{LANG_KEY_CONST.TOOLTIP_FILTER}</Typography>
              </TooltipContent>
            </Tooltip>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-71">
            <DropdownMenuLabel>{LANG_KEY_CONST.FILTER}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sort</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 mr-auto">
                      <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                      <Typography className="font-medium">Sort</Typography>
                    </div>
                    <div className="w-full flex justify-between items-center gap-1.5">
                      <Select
                        value={sortField.sortBy}
                        onValueChange={handleSortByChange}
                      >
                        <SelectTrigger size="sm" className="flex-1">
                          <SelectValue placeholder="thuộc tính" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {renderListSorts()}
                        </SelectContent>
                      </Select>

                      <Select
                        value={sortField.order}
                        onValueChange={handleOrderChange}
                      >
                        <SelectTrigger size="sm" className="flex-1">
                          <SelectValue placeholder="Thứ tự" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="asc">Tăng dần</SelectItem>
                          <SelectItem value="desc">Giảm dần</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex justify-end items-center gap-1.5">
                    <Button variant={"outline"}>
                      <Eraser /> Cancel
                    </Button>
                    <Button
                      disabled={!hasApplyFilter}
                      onClick={handleApplySort}
                    >
                      <SearchCheck className="text-current" />
                      Inquire
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {hasFilters &&
              filters.map((filter, index) => (
                <DropdownMenuSub key={index}>
                  <DropdownMenuSubTrigger>
                    {filter.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {filter.type === "select" && filter.options && (
                        <DropdownMenuItem>
                          <Select
                            value={filter.value}
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

                      {filter.type === "input" && (
                        <div onSelect={(e) => e.preventDefault()}>
                          <Input
                            placeholder={filter.placeholder}
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                          />
                        </div>
                      )}
                      <DropdownMenuItem className="flex justify-end items-center gap-1.5">
                        <Button onClick={handleClear} variant={"outline"}>
                          <Eraser /> Clear
                        </Button>
                        <Button onClick={() => filter.onApply?.()}>
                          <SearchCheck className="text-current" />
                          Inquire
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>

                  {filter.type === "custom" && filter.render?.()}
                </DropdownMenuSub>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TanstackTableFilter;
