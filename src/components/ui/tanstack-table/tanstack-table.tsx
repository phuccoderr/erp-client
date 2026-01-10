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
  type Table as TableState,
  type HeaderGroup,
  type Row,
  type RowModel,
  type Cell,
} from "@tanstack/react-table";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";

type TableContextType<TData> = TableState<TData> & {
  dataLength: number;
  isPagination: boolean;
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
};

const TanstackTableContext = createContext<TableContextType<unknown> | null>(
  null
);

function useTanstackTable() {
  const context = useContext(TanstackTableContext);
  if (!context) {
    throw new Error(
      "useTanstackTable must be used within a TanstackTableProvider."
    );
  }

  return context;
}

interface TanstackTableProps<TData> {
  children: ReactNode;
  data: TData[];
  columns: ColumnDef<TData>[];
  pinning?: string[];
  isPagination?: boolean;
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

function TanstackTable<TData>({
  children,
  data,
  columns,
  pinning,
  isPagination = false,
  meta,
}: Readonly<TanstackTableProps<TData>>) {
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
    // Visibility
    onColumnVisibilityChange: setColumnVisibility,
    // Sorting
    onSortingChange: setSorting,
    // Pinning
    onColumnPinningChange: setColumnPinning,
    // Expand
    getExpandedRowModel: getExpandedRowModel(),
    // Filter
    getFilteredRowModel: isPagination ? undefined : getFilteredRowModel(),
    // Pagination
    getPaginationRowModel: isPagination ? undefined : getPaginationRowModel(),
    getSortedRowModel: isPagination ? undefined : getSortedRowModel(),
    getSubRows: (row: any) => row.children,
    // Client or Server
    manualPagination: isPagination,
    manualFiltering: isPagination,
    pageCount: isPagination ? meta.total_pages : undefined,
  });

  return (
    <TanstackTableContext.Provider
      value={{
        isPagination,
        meta,
        dataLength: data.length,
        ...(table as TableState<unknown>),
      }}
    >
      {children}
    </TanstackTableContext.Provider>
  );
}

interface ContentProps {
  children: ReactNode;
}
function TanstackTableContent({ children }: ContentProps) {
  return <div className="border rounded-sm">{children}</div>;
}

interface DataProps {}

function TanstackTableData({}: DataProps) {
  const { getHeaderGroups, getRowModel } = useTanstackTable();

  const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
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
    <Table>
      <TableHeader>
        {getHeaderGroups().map((headerGroup) => (
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
        {getRowModel().rows.length !== 0 ? (
          getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  style={{ ...getCommonPinningStyles(cell.column) }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}

              {/* Expanded subrow - chú ý đặt đúng vị trí: cùng cấp với TableRow chính, hoặc dùng Fragment */}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={getRowModel().rows.length} // hoặc manageColumns.length nếu bạn quản lý columns riêng
              className="h-24 text-center"
            >
              {LANG_KEY_CONST.EMPTY_TABLE_LIST}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export {
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  useTanstackTable,
};
