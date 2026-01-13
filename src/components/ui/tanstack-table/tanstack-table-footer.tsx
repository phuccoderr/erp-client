import React, { useCallback, useMemo, type ReactNode } from "react";
import {
  Button,
  ButtonGroup,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Typography,
  useTanstackTable,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useLang } from "@hooks/use-lang";

interface TanstackTableFooterProps {
  onPageChange?: (page: number) => void;
}

const TanstackTableFooter = ({ onPageChange }: TanstackTableFooterProps) => {
  const {
    getState,
    getPageCount,
    previousPage,
    nextPage,
    setPageIndex,
    dataLength,
    isPagination,
    meta,
  } = useTanstackTable();
  const { t } = useLang();

  const paginationInfo = useMemo(() => {
    const currentPage = isPagination
      ? meta.page
      : getState().pagination.pageIndex + 1;
    const pageSize = isPagination ? meta.limit : getState().pagination.pageSize;
    const total = isPagination ? meta.total : dataLength;
    const totalPages = isPagination ? meta.total_pages : getPageCount();

    const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, total);

    return {
      currentPage,
      pageSize,
      total,
      totalPages,
      from,
      to,
    };
  }, [
    isPagination,
    meta.page,
    meta.limit,
    meta.total,
    meta.total_pages,
    getState().pagination.pageIndex,
    getState().pagination.pageSize,
    dataLength,
    getPageCount,
  ]);
  const { currentPage, totalPages, from, to, total } = paginationInfo;

  const handleClickChangePage = useCallback(
    (isPrevious: boolean) => {
      if (isPrevious) {
        if (isPagination) {
          onPageChange?.(currentPage - 1);
        } else {
          previousPage();
        }
      } else {
        if (isPagination) {
          onPageChange?.(currentPage + 1);
        } else {
          nextPage();
        }
      }
    },
    [isPagination, currentPage, onPageChange, previousPage, nextPage]
  );

  const handlePageClick = useCallback(
    (page: number) => {
      if (isPagination) {
        onPageChange?.(page);
      } else {
        setPageIndex(page - 1);
      }
    },
    [isPagination, onPageChange, setPageIndex]
  );

  const handleGoToPage = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;

      const input = e.target as HTMLInputElement;
      const value = input.value.trim();
      if (!value) return;

      const page = Number(value);
      if (isNaN(page) || page < 1) {
        input.value = "";
        return;
      }

      if (page > totalPages) {
        input.value = totalPages.toString();
        return;
      }

      if (isPagination) {
        onPageChange?.(page);
      } else {
        setPageIndex(page - 1);
      }

      input.blur();
    },
    [isPagination, totalPages, onPageChange, setPageIndex]
  );

  const pageButtons = useMemo(() => {
    const pages: ReactNode[] = [];
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
  }, [currentPage, totalPages, handlePageClick]);

  return (
    <div className="w-full flex items-center py-2 px-4 gap-2 border-t">
      <Typography className="text-xs sm:flex-1 sm:flex hidden">
        {from} - {to} {t(LANG_KEY_CONST.TABLE_OF)} {total}
      </Typography>
      <ButtonGroup className="flex-1 flex sm:justify-center justify-start">
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
          {pageButtons}
          <Button
            onClick={() => handleClickChangePage(false)}
            disabled={
              currentPage === (isPagination ? meta.total_pages : getPageCount())
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
          <Typography className="text-xs">
            {t(LANG_KEY_CONST.TABLE_GO_TO_PAGE)}
          </Typography>
          <Tooltip>
            <TooltipTrigger>
              <Input
                type="number"
                placeholder={t(
                  LANG_KEY_CONST.TABLE_INPUT_GO_TO_PAGE_PLACEHOLDER
                )}
                min={1}
                max={isPagination ? meta?.total_pages : getPageCount()}
                className="w-28 rounded-sm p-2"
                onKeyDown={handleGoToPage}
              />
            </TooltipTrigger>
            <TooltipContent>
              {t(LANG_KEY_CONST.TABLE_TOOLTIP_GO_TO_PAGE)}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export { TanstackTableFooter };
