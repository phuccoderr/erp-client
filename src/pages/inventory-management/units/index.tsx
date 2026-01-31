import {
  Button,
  TanstackTable,
  TanstackTableContent,
  TanstackTableData,
  TanstackTableFilter,
  TanstackTableFooter,
  TanstackTableHeader,
  TanstackTableHeaderRight,
} from "@components/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { type FindAllUnit, type Unit, type UnitFieldSort } from "@types";
import { ArrowUpDown, FileSearchCorner, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FilterUtils, queryClient, StringUtils } from "@utils";
import { useLang } from "@hooks/use-lang";
import { LANG_KEY_CONST, TANSTACK_KEY_CONST } from "@constants";
import UnitUpdateDialog from "./components/unit-update-dialog.component";
import UnitCreateDialog from "./components/unit-create-dialog.component";
import { UnitApi, useCommandDeleteUnit, useQueryUnits } from "@apis/units";
import { toast } from "sonner";
import { AlertDialogDelete } from "@components/ui/alert-dialog-delete";

const UnitsPage = () => {
  const { t, data: dataLang } = useLang();
  const [filters, setFilters] = useState<FindAllUnit>({
    page: 1,
    take: 15,
    pagination: true,
  });
  const [query, setQuery] = useState<FindAllUnit>({
    page: 1,
    take: 15,
    pagination: true,
  });
  const { data, isFetching, isLoading, refetch } = useQueryUnits(query);
  const { mutate: mutateDeleteUnit } = useCommandDeleteUnit();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [unitId, setUnitId] = useState(0);

  const toggleOpenUpdate = (unitId: number) => {
    setUnitId(unitId);
    setOpenUpdate(true);
  };

  const toggleOpenCreate = () => {
    setOpenCreate(true);
  };

  const toggleOpenDelete = (roleId: number) => {
    setUnitId(roleId);
    setOpenDelete(true);
  };

  const toggleActionDelete = () => {
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
  };

  const columnHelper = createColumnHelper<Unit>();
  const columns = [
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
      header: "ok",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
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
  ];
  const csvHeaders = columns.map((col) => ({
    label: col.header as string,
    key: col.id as string,
  }));
  const fieldSorts: Record<UnitFieldSort, string> = {
    name: t(LANG_KEY_CONST.UNIT_FIELD_NAME),
    code: t(LANG_KEY_CONST.UNIT_FIELD_DESCRIPTION),
    description: t(LANG_KEY_CONST.UNIT_FIELD_CODE),
  };

  const primaryOptions = useMemo(
    () =>
      Object.entries(fieldSorts).map(([value, label]) => ({
        value,
        label,
      })),
    [dataLang],
  );

  const handlePageChange = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page }));
  }, []);

  const handleApplySort = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: filters.orderBy,
      order: filters.order,
    }));
  }, [filters.orderBy, filters.order]);

  const handleApplyName = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      name: filters.name,
    }));
  }, [filters.name]);

  const handleApplyCode = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      code: filters.code,
    }));
  }, [filters.code]);

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
        >
          <TanstackTableHeaderRight
            csv={{
              headers: csvHeaders,
              filename: "units-2026.csv",

              fetchAllRecords: async () => {
                const res = await UnitApi.findAll({ pagination: false });
                return res.data.entities;
              },
            }}
          />
          <Button onClick={toggleOpenCreate}>
            +{t(LANG_KEY_CONST.UNIT_TITLE_ADD)}
          </Button>
        </TanstackTableHeader>
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
                onPrimaryChange: (value) => {
                  const orderBy = value as keyof Unit;
                  setFilters((prev) => ({
                    ...prev,
                    orderBy,
                  }));
                },
                secondaryValue: filters.order,
                secondaryPlaceholder: t(LANG_KEY_CONST.COMMON_ORDER),
                secondaryOptions: [
                  { value: "asc", label: t(LANG_KEY_CONST.COMMON_ASC) },
                  { value: "desc", label: t(LANG_KEY_CONST.COMMON_DESC) },
                ],
                onSecondaryChange: (value) => {
                  const order = value === "desc" ? "desc" : "asc";
                  setFilters((prev) => ({
                    ...prev,
                    order,
                  }));
                },
                onApply: handleApplySort,
                onClear: () => {
                  setFilters((prev) => ({
                    ...prev,
                    orderBy: undefined,
                    order: undefined,
                  }));
                  setQuery((prev) => ({
                    ...prev,
                    orderBy: undefined,
                    order: undefined,
                  }));
                },
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
                onChange: (name) => {
                  setFilters((prev) => ({ ...prev, name }));
                },
                onApply: handleApplyName,
                onClear: () => {
                  setFilters((prev) => ({
                    ...prev,
                    name: undefined,
                  }));
                  setQuery((prev) => ({
                    ...prev,
                    name: undefined,
                  }));
                },
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
                onChange: (code) => {
                  setFilters((prev) => ({ ...prev, code }));
                },
                onApply: handleApplyCode,
                onClear: () => {
                  setFilters((prev) => ({
                    ...prev,
                    code: undefined,
                  }));
                  setQuery((prev) => ({
                    ...prev,
                    code: undefined,
                  }));
                },
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
