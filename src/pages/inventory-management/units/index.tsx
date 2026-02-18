import {
  Button,
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  TanstackTableFilter,
  TanstackTableFooter,
  TanstackTableHeader,
} from "@components/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, FileSearchCorner, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FilterUtils, queryClient, StringUtils } from "@utils";
import { useLang } from "@hooks/use-lang";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import UnitUpdateDialog from "./components/unit-update-dialog";
import UnitCreateDialog from "./components/unit-create-dialog";
import { UnitApi, useCommandDeleteUnit, useQueryUnits } from "@apis/units";
import { toast } from "sonner";
import { AlertDialogDelete } from "@components/ui/alert-dialog-delete";
import type { FindAllUnit, Unit, UnitFieldSort } from "@types";
import { useFilterTable } from "@hooks/use-filter-table";

const UnitsPage = () => {
  const { t, data: langs } = useLang();
  const {
    filters,
    setFilters,
    query,
    setQuery,
    resetSort,
    sortOptions,
    handleOrderBy,
    handleOrder,
  } = useFilterTable<FindAllUnit>();
  const { data, isFetching, isLoading, refetch } = useQueryUnits(query);
  const { mutate: mutateDeleteUnit } = useCommandDeleteUnit();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [unitId, setUnitId] = useState(0);

  const toggleOpenUpdate = useCallback((unitId: number) => {
    setUnitId(unitId);
    setOpenUpdate(true);
  }, []);

  const toggleOpenCreate = useCallback(() => {
    setOpenCreate(true);
  }, []);

  const toggleOpenDelete = useCallback((roleId: number) => {
    setUnitId(roleId);
    setOpenDelete(true);
  }, []);

  const toggleActionDelete = useCallback(() => {
    mutateDeleteUnit(unitId, {
      onSuccess: () => {
        setUnitId(0);
        queryClient.invalidateQueries({
          queryKey: [TANSTACK_KEY_CONST.QUERY_UNIT],
        });
        toast.success(LANG_KEY_CONST.COMMON_DELETE_SUCCESS);
        setOpenDelete(false);
      },
    });
  }, [unitId]);

  const columnHelper = createColumnHelper<Unit>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t(LANG_KEY_CONST.UNIT_FIELD_NAME),
        enableHiding: false,
      }),
      columnHelper.accessor("code", {
        header: t(LANG_KEY_CONST.UNIT_FIELD_CODE),
        enableHiding: false,
      }),
      columnHelper.accessor("description", {
        header: t(LANG_KEY_CONST.UNIT_FIELD_DESCRIPTION),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-1 items-center">
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => toggleOpenUpdate(row.original.id)}
            >
              <SquarePen />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => toggleOpenDelete(row.original.id)}
            >
              <Trash2 />
            </Button>
          </div>
        ),
      }),
    ],
    [langs],
  );
  const csvHeaders = useMemo(
    () => [
      {
        label: t(LANG_KEY_CONST.UNIT_FIELD_NAME),
        key: "name",
      },
    ],
    [],
  );
  const fieldSorts: Record<UnitFieldSort, string> = useMemo(
    () => ({
      name: t(LANG_KEY_CONST.UNIT_FIELD_NAME),
      code: t(LANG_KEY_CONST.UNIT_FIELD_DESCRIPTION),
      description: t(LANG_KEY_CONST.UNIT_FIELD_CODE),
    }),
    [],
  );

  const primaryOptions = useMemo(
    () =>
      Object.entries(fieldSorts).map(([value, label]) => ({
        value,
        label,
      })),
    [langs],
  );

  const handleApplySort = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: filters.orderBy,
      order: filters.order,
    }));
  }, [filters]);

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handleApplyCode = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      code: filters.code,
    }));
  }, [filters.code]);

  const handleClearCode = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      code: undefined,
    }));
    setQuery((prev) => ({
      ...prev,
      code: undefined,
    }));
  }, [filters]);

  const handleChangeCode = useCallback(
    (code: string) => {
      setFilters((prev) => ({ ...prev, code }));
    },
    [filters],
  );

  const handleApplyName = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      name: filters.name,
    }));
  }, [filters.name]);

  const handleChangeName = useCallback(
    (name: string) => {
      setFilters((prev) => ({ ...prev, name }));
    },
    [filters],
  );

  const handleClearName = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      name: undefined,
    }));
    setQuery((prev) => ({
      ...prev,
      name: undefined,
    }));
  }, [filters]);

  return (
    <>
      <TanstackTable
        data={data?.entities ?? []}
        columns={columns}
        isPagination={query.pagination}
        meta={data?.meta ?? { take: 0, page: 0, total: 0, total_pages: 0 }}
        pinning={["name", "code"]}
      >
        <TanstackTableHeader
          title={StringUtils.capitalize(t(LANG_KEY_CONST.UNIT))}
          titleAdd={t(LANG_KEY_CONST.UNIT_TITLE_ADD)}
          onAdd={toggleOpenCreate}
          csv={{
            headers: csvHeaders,
            filename: "units-2026.csv",

            fetchAllRecords: async () => {
              const res = await UnitApi.findAll({ pagination: false });
              return res.data.entities;
            },
          }}
        />
        <TanstackTableContent>
          <TanstackTableFilter
            isFetching={isFetching}
            onRefresh={refetch}
            // Filter
            filters={[
              {
                type: "two-select",
                icon: <ArrowUpDown />,
                label: t(LANG_KEY_CONST.COMMON_SORT),
                state: FilterUtils.getSortState(
                  query.orderBy,
                  query.order,
                  fieldSorts,
                ),
                primaryValue: filters.orderBy,
                primaryPlaceholder: t(LANG_KEY_CONST.COMMON_FIELD),
                primaryOptions: primaryOptions,
                onPrimaryChange: handleOrderBy,
                secondaryValue: filters.order,
                secondaryPlaceholder: t(LANG_KEY_CONST.COMMON_ORDER),
                secondaryOptions: sortOptions,
                onSecondaryChange: handleOrder,
                onApply: handleApplySort,
                onClear: resetSort,
              },
              {
                type: "input",
                icon: <FileSearchCorner />,
                state: FilterUtils.getSearchState(
                  query.name,
                  t(LANG_KEY_CONST.UNIT_FIELD_NAME),
                ),
                label: t(LANG_KEY_CONST.UNIT_FIELD_NAME),
                value: filters.name ?? "",
                placeholder: `${t(LANG_KEY_CONST.COMMON_SEARCH)} ${t(
                  LANG_KEY_CONST.UNIT_FIELD_NAME,
                )}`,
                onChange: handleChangeName,
                onApply: handleApplyName,
                onClear: handleClearName,
              },
              {
                type: "input",
                icon: <FileSearchCorner />,
                state: FilterUtils.getSearchState(
                  query.code,
                  t(LANG_KEY_CONST.UNIT_FIELD_CODE),
                ),
                label: t(LANG_KEY_CONST.UNIT_FIELD_CODE),
                value: filters.code ?? "",
                placeholder: `${t(LANG_KEY_CONST.COMMON_SEARCH)} ${t(
                  LANG_KEY_CONST.UNIT_FIELD_CODE,
                )}`,
                onChange: handleChangeCode,
                onApply: handleApplyCode,
                onClear: handleClearCode,
              },
            ]}
          />
          <TanstackTableData isLoading={isLoading} />
          <TanstackTableFooter onPageChange={handlePageChange} />
        </TanstackTableContent>
      </TanstackTable>
      <UnitUpdateDialog
        isOpen={openUpdate}
        onOpenChange={setOpenUpdate}
        unitId={unitId}
      />
      <UnitCreateDialog isOpen={openCreate} onOpenChange={setOpenCreate} />
      <AlertDialogDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        toggleDelete={toggleActionDelete}
      />
    </>
  );
};

export default UnitsPage;
