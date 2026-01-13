import {
  cloneElement,
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Badge,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogClose,
  DialogContainer,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Input,
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
  ChevronsUpDown,
  Funnel,
  FunnelPlus,
  Grid2x2,
  RefreshCw,
  SearchCheck,
  TextSearch,
  Trash2,
  X,
} from "lucide-react";
import { LANG_KEY_CONST } from "@constants";
import { ButtonAnimated } from "@components/animations";
import { motion } from "motion/react";
import { useLang } from "@hooks/use-lang";
import { useIsMobile } from "@hooks/use-mobile";

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
  onClear?: () => void;
  render?: () => ReactNode;
  icon?: ReactElement;
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

const FilterContent = (filter: FilterItem) => {
  switch (filter.type) {
    case "two-select":
      return (
        <div className="flex gap-1.5">
          <Select
            value={filter.primaryValue ?? ""}
            onValueChange={filter.onPrimaryChange}
          >
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue placeholder={filter.primaryPlaceholder} />
            </SelectTrigger>
            <SelectContent position="popper">
              {filter.primaryOptions?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.secondaryValue ?? ""}
            onValueChange={filter.onSecondaryChange}
          >
            <SelectTrigger size="sm" className="flex-1">
              <SelectValue placeholder={filter.secondaryPlaceholder} />
            </SelectTrigger>
            <SelectContent position="popper">
              {filter.secondaryOptions?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case "input":
      return (
        <Input
          placeholder={filter.placeholder}
          value={filter.value ?? ""}
          onChange={(e) => filter.onChange?.(e.target.value)}
        />
      );
    case "select":
      return (
        <Select value={filter.value ?? ""} onValueChange={filter.onChange}>
          <SelectTrigger size="sm">
            <SelectValue placeholder={filter.placeholder ?? "Chọn..."} />
          </SelectTrigger>
          <SelectContent>
            {filter.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
  }
};

const TanstackTableFilter = ({
  filters = [],
  onRefresh,
  isFetching = false,
}: TanstackTableFilterProps) => {
  const [openDropdownFilter, setOpenDropdownFilter] = useState(false);
  const { getAllColumns, getAllLeafColumns } = useTanstackTable();
  const { t } = useLang();
  const isMobile = useIsMobile();

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

  const renderActiveFilterBadges = useMemo(() => {
    return filters
      .filter((item) => item.state)
      .map((item) => (
        <Dialog>
          <motion.div
            key={item.key ?? item.label}
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
            className="inline-block"
          >
            <DialogTrigger asChild>
              <Badge variant="outline">
                {item.state}
                <Button
                  variant="outline_primary"
                  className="w-3 h-3 rounded-full has-[>svg]:px-0 "
                  onClick={() => item.onClear?.()}
                >
                  <X className="size-2" />
                </Button>
              </Badge>
            </DialogTrigger>
            <DialogContainer>
              <DialogHeader>
                <DialogTitle className="">
                  {isValidElement(item.icon)
                    ? cloneElement(item.icon as React.ReactElement<any>, {
                        className: "w-4 h-4",
                      })
                    : item.icon}
                  {item.label}
                </DialogTitle>
              </DialogHeader>
              <DialogContent>{FilterContent(item)}</DialogContent>
              <DialogFooter className="">
                <DialogClose asChild>
                  <Button variant={"outline"}>
                    <Ban /> {t(LANG_KEY_CONST.COMMON_CANCEL)}
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    disabled={
                      item.value
                        ? false
                        : item.primaryValue && item.secondaryValue
                        ? false
                        : true
                    }
                    onClick={() => {
                      item.onApply?.();
                    }}
                  >
                    <SearchCheck className="text-current" />
                    {t(LANG_KEY_CONST.COMMON_APPLY_FILTER)}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContainer>
          </motion.div>
        </Dialog>
      ));
  }, [filters]);

  const hasFilters = filters.length > 0;
  const length = filters.reduce(
    (count, item) => count + (item.state ? 1 : 0),
    0
  );

  return (
    <>
      <div className="border-b flex justify-between items-center py-2 px-4">
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger>
              <div className="relative inline-flex cursor-pointer">
                <TextSearch className="text-foreground" size={20} />
                {length > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -right-4 -top-1.5 h-4 min-w-4 rounded-full px-1 text-[8px]"
                  >
                    {length}+
                  </Badge>
                )}
              </div>
            </DialogTrigger>
            <DialogContainer>
              <DialogHeader>
                <DialogTitle>
                  <Funnel className="w-4 h-4 text-muted-foreground" />
                  {t(LANG_KEY_CONST.COMMON_FILTER)}
                </DialogTitle>
              </DialogHeader>
              <DialogContent className="flex flex-col gap-2">
                {filters.map((item) => {
                  if (!item.state) return;
                  return (
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="rounded-sm flex-1 min-h-8 justify-start"
                          >
                            {item.icon}
                            {item.state.toLowerCase()}
                            <ChevronsUpDown />
                          </Badge>
                          <Button
                            variant="outline_red"
                            size="icon-sm"
                            onClick={() => item.onClear?.()}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="flex flex-col gap-2 mt-2">
                        {FilterContent(item)}
                        <div className="flex justify-end">
                          <Button
                            disabled={
                              item.value
                                ? false
                                : item.primaryValue && item.secondaryValue
                                ? false
                                : true
                            }
                            onClick={() => {
                              item.onApply?.();
                            }}
                          >
                            <SearchCheck className="text-current" />
                            {t(LANG_KEY_CONST.COMMON_APPLY_FILTER)}
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </DialogContent>
            </DialogContainer>
          </Dialog>
          <div className={`sm:flex items-center gap-1.5 flex-wrap hidden`}>
            {renderActiveFilterBadges}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {/* Filter */}
          <DropdownMenu
            open={openDropdownFilter}
            onOpenChange={setOpenDropdownFilter}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="outline">
                    <FunnelPlus />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <Typography>{t(LANG_KEY_CONST.COMMON_FILTER)}</Typography>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align={isMobile ? "start" : "end"}>
              <DropdownMenuLabel>
                {t(LANG_KEY_CONST.COMMON_FILTER)}
              </DropdownMenuLabel>
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
                          {FilterContent(filter)}
                        </div>

                        <div className="flex justify-end items-center gap-2 px-1.5 py-2">
                          <Button
                            variant={"outline"}
                            onClick={() => setOpenDropdownFilter(false)}
                          >
                            <Ban /> {t(LANG_KEY_CONST.COMMON_CANCEL)}
                          </Button>
                          <Button
                            disabled={
                              filter.value
                                ? false
                                : filter.primaryValue && filter.secondaryValue
                                ? false
                                : true
                            }
                            onClick={() => {
                              filter.onApply?.();
                              setOpenDropdownFilter(false);
                            }}
                          >
                            <SearchCheck className="text-current" />
                            {t(LANG_KEY_CONST.COMMON_APPLY_FILTER)}
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
              <Typography>
                {t(LANG_KEY_CONST.COMMON_TOOLTIP_REFRESH)}
              </Typography>
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
                    column.isVisible
                      ? "focus:bg-outline"
                      : "focus:bg-transparent"
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
    </>
  );
};

export { TanstackTableFilter };
