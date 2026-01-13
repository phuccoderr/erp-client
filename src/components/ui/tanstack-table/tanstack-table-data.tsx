import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTanstackTable } from "./tanstack-table";
import { flexRender, type Column } from "@tanstack/react-table";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";

interface TanstackTableDataProps {
  isLoading?: boolean;
}

function TanstackTableData({ isLoading = false }: TanstackTableDataProps) {
  const { t } = useLang();
  const tableContainerRef = useRef<HTMLTableElement>(null);
  const { getHeaderGroups, getRowModel, getAllColumns } = useTanstackTable();
  const [scrollPosition, setScrollPosition] = useState(false);

  const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === "left" && column.getIsLastColumn("left");

    return {
      transition: "box-shadow 0.4s ease-out",
      boxShadow:
        isLastLeftPinnedColumn && scrollPosition
          ? "-4px 0 4px -4px gray inset"
          : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  const getHeaderPinningStyles = (column: Column<any>): CSSProperties => {
    const isFirstColumn = column.getIsFirstColumn();
    return {
      ...getCommonPinningStyles(column),
      top: 0,
      zIndex: isFirstColumn ? 2 : 1,
      position: "sticky",
    };
  };

  useEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;

    const handleScroll = () => {
      const { scrollLeft } = tableContainer;
      if (scrollLeft > 0) {
        setScrollPosition(true);
      } else {
        setScrollPosition(false);
      }
    };

    handleScroll();

    tableContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      tableContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <Table ref={tableContainerRef}>
      <TableHeader>
        {getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                style={{
                  ...getHeaderPinningStyles(header.column),
                }}
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
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={`skeleton-${index}`}>
              {getAllColumns().map((column) => (
                <TableCell key={column.id}>
                  <Skeleton className="h-4 w-[85%] rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : getRowModel().rows.length !== 0 ? (
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
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={getAllColumns().length}
              className="h-24 text-center"
            >
              {t(LANG_KEY_CONST.TABLE_LIST_EMPTY)}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export { TanstackTableData };
