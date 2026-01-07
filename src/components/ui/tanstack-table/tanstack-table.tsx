import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type VisibilityState,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type SortingState,
} from "@tanstack/react-table";
import {
  createContext,
  useCallback,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowDownWideNarrow,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpNarrowWide,
} from "lucide-react";
import {
  Typography,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ButtonGroup,
  Input,
} from "@components/ui";
import TanstackTableFilter, {
  type FilterItem,
  type ManageColumnItem,
  type SortOption,
} from "./tanstack-table-filter";

const TanstackTableContext = createContext(null);

interface TanstackTableProps {
  children: ReactNode;
}

function TanstackTable({ children }: Readonly<TanstackTableProps>) {
  return (
    <TanstackTableContext.Provider value={null}>
      {children}
    </TanstackTableContext.Provider>
  );
}

interface HeaderProps {
  children: ReactNode;
  title?: string;
}
function TanstackTableHeader({ children, title }: HeaderProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <Typography variant="h4" className="flex-1">
        {title}
      </Typography>
      <div className="flex items-end">{children}</div>
    </div>
  );
}

interface ContentProps {
  children: ReactNode;
}
function TanstackTableContent({ children }: ContentProps) {
  return <div className="border rounded-sm">{children}</div>;
}

interface DataProps<TData> {
  columns: ColumnDef<TData>[];
  pinning?: string[];
  // Props query
  data: TData[];
  isFetching?: boolean;
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  // Props Pagination
  isPagination?: boolean;
  onPageChange?: (page: number) => void;
  // Props Filter
  filters?: FilterItem[];
  sortOptions?: SortOption[];
  onRefresh?: () => void;
  onApplySort?: (sortField: { sortBy: string; order: string }) => void;
}

function TanstackTableData<TData>({
  data,
  columns,
  isPagination = true,
  isFetching = false,
  meta,
  pinning,
  onRefresh,
  onPageChange,
  sortOptions,
  onApplySort,
  filters,
}: DataProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinning,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: isPagination ? meta.limit : 15,
        pageIndex: isPagination ? meta.page : 0,
      },
      columnVisibility: {
        id: false,
        _id: false,
      },
    },
    state: {
      columnVisibility,
      sorting,
      columnPinning,
    },
    defaultColumn: {
      size: 100,
    },
    getCoreRowModel: getCoreRowModel(),
    // Pinning
    onColumnPinningChange: setColumnPinning,
    // Pagination
    getPaginationRowModel: isPagination ? undefined : getPaginationRowModel(),
    // Filter
    getFilteredRowModel: isPagination ? undefined : getFilteredRowModel(),
    // Sorting
    getSortedRowModel: isPagination ? undefined : getSortedRowModel(),
    onSortingChange: setSorting,
    // Visibility
    onColumnVisibilityChange: setColumnVisibility,
    // Expand
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.children,
    // Client or Server
    manualPagination: isPagination,
    manualFiltering: isPagination,
    pageCount: isPagination ? meta.total_pages : undefined,
  });

  const currentPage = isPagination
    ? meta.page
    : table.getState().pagination.pageIndex + 1;
  const pageSize = isPagination
    ? meta.limit
    : table.getState().pagination.pageSize;
  const total = isPagination ? meta.total : data.length;
  const from = data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  const handleClickChangePage = useCallback(
    (is_previous: boolean) => {
      if (is_previous) {
        if (isPagination) {
          onPageChange?.(currentPage - 1);
        } else {
          table.previousPage();
        }
      } else {
        if (isPagination) {
          onPageChange?.(currentPage + 1);
        } else {
          table.nextPage();
        }
      }
    },
    [isPagination, onPageChange, currentPage, table]
  );

  const handlePageClick = useCallback(
    (page: number) => {
      if (isPagination) {
        onPageChange?.(page);
      } else {
        table.setPageIndex(page - 1);
      }
    },
    [isPagination, onPageChange, table]
  );

  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = isPagination ? meta.total_pages : table.getPageCount();
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          variant={i === currentPage ? "default" : "outline"}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  const handleGoToPage = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;

      const input = e.target as HTMLInputElement;
      const page = Number(input.value.trim());

      if (isNaN(page) || page < 1) {
        input.value = "";
        return;
      }

      const maxPage = isPagination
        ? meta?.total_pages ?? 1
        : table.getPageCount();

      if (page > maxPage) {
        input.value = maxPage.toString();
        return;
      }

      if (isPagination) {
        onPageChange?.(page);
      } else {
        table.setPageIndex(page - 1);
      }

      input.blur();
    },
    [isPagination, meta?.total_pages, onPageChange, table]
  );

  const getCommonPinningStyles = (column: Column<TData>): CSSProperties => {
    const isPinned = column.getIsPinned();
    // const isLastLeftPinnedColumn =
    //   isPinned === "left" && column.getIsLastColumn("left");

    return {
      // boxShadow: isLastLeftPinnedColumn
      //   ? "-4px 0 4px -4px gray inset"
      //   : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  const manageColumns: ManageColumnItem[] = table
    .getAllLeafColumns()
    .map((column) => ({
      id: column.id,
      isVisible: column.getIsVisible(),
      canHide: column.getCanHide(),
      onChecked: (checked) => {
        column.toggleVisibility(!!checked);
      },
      label:
        (column.columnDef.header as string) ?? column.id.replace(/_/g, " "),
    }));

  return (
    <>
      {/* Filter */}
      <TanstackTableFilter
        checkedAll={table
          .getAllColumns()
          .every((column) => column.getIsVisible())}
        onCheckedAll={(checked) => {
          table.getAllLeafColumns().forEach((column) => {
            if (column.getCanHide() !== false) {
              column.toggleVisibility(!!checked);
            }
          });
        }}
        columns={manageColumns}
        isFetching={isFetching}
        onRefresh={onRefresh}
        // Sort
        sortOptions={sortOptions}
        onApplySort={onApplySort}
        // Filer
        filters={filters}
      />
      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ ...getCommonPinningStyles(header.column) }}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2 ">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUpNarrowWide className="w-4 h-4" />,
                        desc: <ArrowDownWideNarrow className="w-4 h-4" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ ...getCommonPinningStyles(cell.column) }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getAllCells().length}></td>
                  </tr>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Footer */}
      <div className="w-full flex items-center py-2 px-4 gap-2 border-t">
        <Typography className="text-xs flex-1">
          Showing {from} to {to} of {total} {total === 1 ? "entry" : "entries"}
        </Typography>
        <ButtonGroup className="flex-1 flex justify-center">
          <ButtonGroup>
            <Button
              onClick={() => handleClickChangePage(true)}
              disabled={currentPage === 1}
              variant="outline"
              size="icon-sm"
              aria-label="Previous"
            >
              <ArrowLeftIcon className="size-3" />
            </Button>
            {renderPageNumbers()}
            <Button
              onClick={() => handleClickChangePage(false)}
              disabled={
                currentPage ===
                (isPagination ? meta.total_pages : table.getPageCount())
              }
              variant="outline"
              size="icon-sm"
              aria-label="Next"
            >
              <ArrowRightIcon className="size-3" />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
        <div className="flex-1">
          <div className="flex justify-end gap-2 items-center">
            <Typography className="text-xs">Go to Page</Typography>
            <Tooltip>
              <TooltipTrigger>
                <Input
                  type="number"
                  placeholder="Page Number"
                  min={1}
                  max={isPagination ? meta?.total_pages : table.getPageCount()}
                  className="w-28 rounded-sm p-2"
                  onKeyDown={handleGoToPage}
                />
              </TooltipTrigger>
              <TooltipContent>Nhập trang mong muốn → Enter</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </>
  );
}

export {
  TanstackTable,
  TanstackTableHeader,
  TanstackTableContent,
  TanstackTableData,
};
