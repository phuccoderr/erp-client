import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { createContext, type ReactNode } from "react";
import { Typography } from "./typography";

import { Button } from "./button";
import { ArrowDownUp, FunnelPlus, Grid2x2, SearchIcon } from "lucide-react";
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
    <div className="flex justify-between items-center h-16">
      <Typography variant="h4" className="flex-1">
        {title}
      </Typography>
      <div className="flex items-end">{children}</div>
    </div>
  );
}
interface FilterProps {}
function TanstackTableFilter({}: FilterProps) {
  return (
    <div className="border-b flex justify-between items-center py-2 px-4">
      <InputGroup variant="outline" className="w-[20%] p-0 shadow-none">
        <InputGroupInput placeholder="Search..." />
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
            <Button size="icon" variant="outline">
              <FunnelPlus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Typography>{LANG_KEY_CONST.TOOLTIP_FILTER}</Typography>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Button size="icon" variant="outline">
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

interface ContentProps {
  children: ReactNode;
}
function TanstackTableContent({ children }: ContentProps) {
  return <div className="border rounded-sm">{children}</div>;
}

interface DataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
function TanstackTableData<TData, TValue>({
  data,
  columns,
}: DataProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnVisibility: {
        id: false,
        _id: false,
      },
    },
    defaultColumn: {
      size: 200,
      minSize: 200,
      maxSize: 250,
    },
    getSubRows: (row: any) => row.children,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
                <TableCell key={cell.id}>
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
  );
}

export {
  TanstackTable,
  TanstackTableHeader,
  TanstackTableContent,
  TanstackTableFilter,
  TanstackTableData,
};
