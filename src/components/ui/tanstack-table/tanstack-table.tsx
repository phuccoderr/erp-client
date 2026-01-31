import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type VisibilityState,
  type ColumnPinningState,
  type SortingState,
  type Table as TableState,
  type AccessorKeyColumnDefBase,
  type IdIdentifier,
  type ColumnDefBase,
  type StringHeaderIdentifier,
} from "@tanstack/react-table";
import { createContext, useContext, useState, type ReactNode } from "react";

type TableContextType<TData> = TableState<TData> & {
  dataLength: number;
  isPagination: boolean;
  meta: {
    total: number;
    page: number;
    take: number;
    total_pages: number;
  };
};

const TanstackTableContext = createContext<TableContextType<unknown> | null>(
  null,
);

function useTanstackTable() {
  const context = useContext(TanstackTableContext);
  if (!context) {
    throw new Error(
      "useTanstackTable must be used within a TanstackTableProvider.",
    );
  }

  return context;
}

interface TanstackTableProps<TData> {
  children: ReactNode;
  data: TData[];
  columns: (
    | (AccessorKeyColumnDefBase<TData, string> &
        Partial<IdIdentifier<TData, string>>)
    | (ColumnDefBase<TData, unknown> & StringHeaderIdentifier)
    | (ColumnDefBase<TData, unknown> & IdIdentifier<TData, unknown>)
  )[];
  pinning?: string[];
  isPagination?: boolean;
  meta: {
    total: number;
    page: number;
    take: number;
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
        pageSize: isPagination ? meta.take : 15,
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
      size: 90,
      minSize: 90,
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

export { TanstackTable, TanstackTableContent, useTanstackTable };
