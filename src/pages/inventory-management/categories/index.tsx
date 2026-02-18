import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CategoryItem } from "./components/category-item";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrayUtils,
  DragAndDropUtils,
  FilterUtils,
  type ResultTreeItem,
} from "@utils";
import { useQueryCategories } from "@apis/categories/category.query";
import type { Category, CategoryFieldSort, FindAllCategory } from "@types";
import {
  useCommandDeleteCategory,
  useCommandUpdateCategory,
} from "@apis/categories/category.command";
import { toast } from "sonner";
import { LANG_KEY_CONST } from "@constants";
import { ArrowUpDown } from "lucide-react";
import { useLang } from "@hooks/use-lang";
import { WrapperFilter, WrapperHeader } from "@components/layouts";
import { useFilterTable } from "@hooks/use-filter-table";
import CategoryCreateDialog from "./components/category-create-dialog";
import CategoryUpdateDialog from "./components/category-update-dialog";
import { AlertDialogDelete, Skeleton } from "@components/ui";

const CategoriesPage = () => {
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<ResultTreeItem<Category>[]>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [cateId, setCateId] = useState(0);
  const [parentId, setParentId] = useState(0);

  const { mutate: updateCategory } = useCommandUpdateCategory();
  const { mutate: deleteCategory } = useCommandDeleteCategory();
  const { t, data: langs } = useLang();
  const { filters, setFilters, query, setQuery, resetSort, sortOptions } =
    useFilterTable<FindAllCategory>();

  const { data: categories, isFetching, refetch } = useQueryCategories(query);

  const flattenedItems = useMemo(() => {
    const flatten = ArrayUtils.flattenTree(items);
    const collapsed = flatten.reduce<number[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      [],
    );
    return ArrayUtils.removeChildrenOf(
      flatten,
      activeId != null ? [activeId, ...collapsed] : collapsed,
    );
  }, [items, activeId]);

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  const sortByOptions = useMemo(() => {
    const fieldSorts: Record<CategoryFieldSort, string> = {
      name: "name",
      description: "description",
      created_at: "created_at",
    };
    return Object.entries(fieldSorts).map(([value, label]) => ({
      value,
      label,
    }));
  }, [langs]);

  const projected =
    activeId && overId
      ? DragAndDropUtils.getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          50,
        )
      : null;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleOpenCreate = useCallback((cateId?: number) => {
    if (cateId) {
      setParentId(cateId);
    }
    setOpenCreate(true);
  }, []);

  const toggleOpenUpdate = useCallback((cateId: number) => {
    setCateId(cateId);
    setOpenUpdate(true);
  }, []);

  const toggleOpenDelete = useCallback((cateId: number) => {
    setCateId(cateId);
    setOpenDelete(true);
  }, []);

  const toggleActionDelete = useCallback(() => {
    deleteCategory(cateId, {
      onSuccess: () => {
        const currentFlatten = ArrayUtils.flattenTree(items).filter(
          (cate) => cate.id !== cateId,
        );
        const newTree = ArrayUtils.buildTreeWithDepth(currentFlatten);
        setItems(newTree);
        setOpenDelete(false);
        toast.success(t(LANG_KEY_CONST.COMMON_DELETE_SUCCESS));
      },
    });
  }, [cateId]);

  const handleApplySort = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: filters.orderBy,
      order: filters.order,
    }));
  }, [filters]);

  const handleAddItems = useCallback(
    (newCategory: Category) => {
      const depthParent = ArrayUtils.flattenTree(items).find(
        (cate) => cate.id === newCategory.parent_id,
      )?.depth;
      const newTreeItem: ResultTreeItem<Category> = {
        ...newCategory,
        id: newCategory.id,
        name: newCategory.name,
        children: [],
        collapsed: false,
        depth: depthParent ? depthParent + 1 : 0,
        parent_id: newCategory.parent_id,
      };
      const currentFlatten = [...ArrayUtils.flattenTree(items), newTreeItem];
      const newTree = ArrayUtils.buildTreeWithDepth(currentFlatten);
      setItems(newTree);
    },
    [items],
  );

  const handleOrderBy = useCallback(
    (value: string) => {
      const orderBy = value as keyof Category;
      setFilters((prev) => ({
        ...prev,
        orderBy,
      }));
    },
    [filters],
  );

  const handleOrder = useCallback(
    (value: string) => {
      const order = value === "desc" ? "desc" : "asc";
      setFilters((prev) => ({
        ...prev,
        order,
      }));
    },
    [filters],
  );

  const handleCollapsed = useCallback(
    (id: UniqueIdentifier) => {
      const collapsedItems = (
        items: ResultTreeItem<Category>[],
        id: UniqueIdentifier,
      ): ResultTreeItem<Category>[] => {
        return items.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              collapsed: !item.collapsed,
            };
          }
          if (item.children?.length) {
            const newChildren = collapsedItems(item.children, id);

            if (newChildren !== item.children) {
              return {
                ...item,
                children: newChildren,
              };
            }
          }
          return item;
        });
      };
      setItems(collapsedItems(items, id));
    },
    [items],
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems = ArrayUtils.flattenTree(items);
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = {
        ...activeTreeItem,
        depth,
        parent_id: parentId,
      };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      setItems(ArrayUtils.buildTreeWithDepth(sortedItems));

      const dataActive = active.data.current;

      if (dataActive?.parent_id !== parentId) {
        updateCategory(
          {
            id: Number(active.id),
            body: { parent_id: Number(parentId) > 0 ? Number(parentId) : null },
          },
          {
            onSuccess: () => {
              toast.success(LANG_KEY_CONST.COMMON_SAVE_SUCCESS);
            },
          },
        );
      }
    }

    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    document.body.style.setProperty("cursor", "");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    document.body.style.setProperty("cursor", "grabbing");
  }

  useEffect(() => {
    if (categories) {
      setItems(ArrayUtils.buildTreeWithDepth(categories.entities));
    }
  }, [categories]);

  return (
    <>
      <WrapperHeader
        title={t(LANG_KEY_CONST.CATEGORY)}
        titleAdd={t(LANG_KEY_CONST.CATEGORY_TITLE_ADD)}
        onAdd={toggleOpenCreate}
      />

      <div className="border rounded-sm">
        <WrapperFilter
          isFetching={isFetching}
          onRefresh={() => refetch()}
          filters={[
            {
              type: "two-select",
              icon: <ArrowUpDown />,
              label: t(LANG_KEY_CONST.COMMON_SORT),
              state: FilterUtils.getSortState(query.orderBy, query.order),
              primaryValue: filters.orderBy,
              primaryPlaceholder: t(LANG_KEY_CONST.COMMON_FIELD),
              primaryOptions: sortByOptions,
              onPrimaryChange: handleOrderBy,
              secondaryValue: filters.order,
              secondaryPlaceholder: t(LANG_KEY_CONST.COMMON_ORDER),
              secondaryOptions: sortOptions,
              onSecondaryChange: handleOrder,
              onApply: handleApplySort,
              onClear: resetSort,
            },
          ]}
        />
        <div className="py-2 px-4">
          {categories ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              measuring={{
                droppable: {
                  strategy: MeasuringStrategy.Always,
                },
              }}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
            >
              <SortableContext
                items={sortedIds}
                strategy={verticalListSortingStrategy}
              >
                {flattenedItems.map(
                  ({
                    id,
                    children,
                    depth,
                    name,
                    parent_id,
                    collapsed,
                    is_active,
                  }) => (
                    <CategoryItem
                      key={id}
                      id={id}
                      parentId={parent_id}
                      depth={
                        id === activeId && projected ? projected.depth : depth
                      }
                      text={name}
                      active={is_active}
                      collapsed={Boolean(collapsed && children.length)}
                      onCollapsed={
                        children.length ? () => handleCollapsed(id) : undefined
                      }
                      onOpenUpdate={toggleOpenUpdate}
                      onOpenCreate={toggleOpenCreate}
                      onOpenDelete={toggleOpenDelete}
                    />
                  ),
                )}
                <DragOverlay>
                  {activeId && activeItem ? (
                    <CategoryItem
                      id={activeId}
                      depth={activeItem.depth}
                      clone
                      parentId={null}
                      text={activeItem.name}
                    />
                  ) : null}
                </DragOverlay>
              </SortableContext>
            </DndContext>
          ) : (
            Array.from({ length: 15 }).map((_, index) => (
              <div
                className="h-8 rounded-sm mt-px border flex items-center justify-center"
                key={index}
              >
                <Skeleton
                  key={index}
                  className="py-2 px-4 w-[98%] rounded-none"
                />
              </div>
            ))
          )}
        </div>
      </div>
      <CategoryCreateDialog
        cateId={parentId}
        isOpen={openCreate}
        onOpenChange={setOpenCreate}
        onNewData={handleAddItems}
      />
      <CategoryUpdateDialog
        cateId={cateId}
        isOpen={openUpdate}
        onOpenChange={setOpenUpdate}
      />
      <AlertDialogDelete
        open={openDelete}
        onOpenChange={setOpenDelete}
        toggleDelete={toggleActionDelete}
      />
    </>
  );
};

export default CategoriesPage;
