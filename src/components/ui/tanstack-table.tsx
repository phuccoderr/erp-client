import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  type SortingState,
  type Table as Tanstack,
} from "@tanstack/react-table";
import {
  createContext,
  useCallback,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Typography } from "./typography";

import { Button } from "./button";
import {
  ArrowDownAZ,
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpNarrowWide,
  FunnelPlus,
  Grid2x2,
  SearchIcon,
} from "lucide-react";
import { LANG_KEY_CONST } from "@constants";
import {
  InputDate,
  InputDateRange,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
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

interface FilterProps {
  table: Tanstack<any>;
}
function TanstackTableFilter({ table }: FilterProps) {
  return (
    <div className="border-b flex justify-between items-center py-2 px-4">
      <InputGroup variant="outline" className="w-[20%] p-0 shadow-none">
        <InputGroupInput
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          placeholder="Search..."
        />
        <InputGroupAddon className="p-0">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex gap-2 items-center">
        <InputDate />
        <InputDateRange />

        <Button variant="outline">
          manage column <Grid2x2 />
        </Button>
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
        <Tooltip>
          <TooltipTrigger>
            <Button size="icon-sm" variant="outline">
              <ArrowDownUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Typography>{LANG_KEY_CONST.TOOLTIP_SORT}</Typography>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

interface DataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  is_pagination?: boolean;
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  onPageChange?: (page: number) => void;
  pinning?: string[];
}

function TanstackTableData<TData, TValue>({
  data,
  columns,
  is_pagination = true,
  meta,
  onPageChange,
  pinning,
}: DataProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: pinning,
  });

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: is_pagination ? meta.limit : 10,
        pageIndex: is_pagination ? meta.page : 0,
      },
      columnVisibility: {
        id: false,
        _id: false,
      },
    },
    state: {
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
    getPaginationRowModel: is_pagination ? undefined : getPaginationRowModel(),
    // Filter
    getFilteredRowModel: is_pagination ? undefined : getFilteredRowModel(),
    // Sorting
    getSortedRowModel: is_pagination ? undefined : getSortedRowModel(),
    onSortingChange: setSorting,
    // Expand
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row: any) => row.children,
    // Client or Server
    manualPagination: is_pagination,
    manualFiltering: is_pagination,
    pageCount: is_pagination ? meta.total_pages : undefined,
  });

  const currentPage = is_pagination
    ? meta.page
    : table.getState().pagination.pageIndex + 1;
  const pageSize = is_pagination
    ? meta.limit
    : table.getState().pagination.pageSize;
  const total = is_pagination ? meta.total : data.length;
  const from = data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  const handleClickChangePage = useCallback(
    (is_previous: boolean) => {
      if (is_previous) {
        if (is_pagination) {
          onPageChange?.(currentPage - 1);
        } else {
          table.previousPage();
        }
      } else {
        if (is_pagination) {
          onPageChange?.(currentPage + 1);
        } else {
          table.nextPage();
        }
      }
    },
    [is_pagination, onPageChange, currentPage, table]
  );

  const handlePageClick = useCallback(
    (page: number) => {
      if (is_pagination) {
        onPageChange?.(page);
      } else {
        table.setPageIndex(page - 1);
      }
    },
    [is_pagination, onPageChange, table]
  );

  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = is_pagination ? meta.total_pages : table.getPageCount();
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

      const maxPage = is_pagination
        ? meta?.total_pages ?? 1
        : table.getPageCount();

      if (page > maxPage) {
        input.value = maxPage.toString();
        return;
      }

      if (is_pagination) {
        onPageChange?.(page);
      } else {
        table.setPageIndex(page - 1);
      }

      input.blur();
    },
    [is_pagination, meta?.total_pages, onPageChange, table]
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
  return (
    <>
      <TanstackTableFilter table={table} />
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
                (is_pagination ? meta.total_pages : table.getPageCount())
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
                  max={is_pagination ? meta?.total_pages : table.getPageCount()}
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
