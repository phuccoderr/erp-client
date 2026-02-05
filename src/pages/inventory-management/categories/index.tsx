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
import { CategoryItem } from "./category-item";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrayUtils,
  DragAndDropUtils,
  FilterUtils,
  type ResultTreeItem,
} from "@utils";
import { useQueryCategories } from "@apis/categories/category.query";
import type { Category, CategoryFieldSort, FindAllCategory } from "@types";
import { useCommandUpdateCategory } from "@apis/categories/category.command";
import { toast } from "sonner";
import { LANG_KEY_CONST } from "@constants";
import { ArrowUpDown } from "lucide-react";
import { useLang } from "@hooks/use-lang";
import { WrapperFilter, WrapperHeader } from "@components/layouts";
import { useFilterTable } from "@hooks/use-filter-table";
import CategoryCreateDialog from "./components/category-create-dialog";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@components/ui/combobox";

const CategoriesPage = () => {
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [items, setItems] = useState<ResultTreeItem<Category>[]>([]);
  const [openCreate, setOpenCreate] = useState(false);

  const { mutate: updateCategory } = useCommandUpdateCategory();
  const { t, data: langs } = useLang();
  const { filters, setFilters, query, setQuery } =
    useFilterTable<FindAllCategory>();

  const { data: categories, isFetching, refetch } = useQueryCategories(query);
  useEffect(() => {
    if (categories) {
      setItems(ArrayUtils.buildTreeWithDepth(categories.entities));
    }
  }, [categories]);

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
  }, [items]);

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems],
  );

  const fieldSorts: Record<CategoryFieldSort, string> = {
    name: "name",
    description: "description",
    created_at: "created_at",
  };

  const primaryOptions = useMemo(
    () =>
      Object.entries(fieldSorts).map(([value, label]) => ({
        value,
        label,
      })),
    [langs],
  );

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

  const toggleOpenCreate = useCallback(() => {
    setOpenCreate(true);
  }, []);

  const handleApplySort = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: filters.orderBy,
      order: filters.order,
    }));
  }, [filters.orderBy, filters.order]);

  function handleCollapsed(id: UniqueIdentifier) {
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
  }

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

      const root: ResultTreeItem<Category> = {
        id: 0,
        children: [],
        collapsed: false,
        depth: 0,
        parent_id: 0,
        created_at: "0",
        description: "",
        is_active: false,
        name: "",
        updated_at: "",
      };
      const nodes: Record<number, ResultTreeItem<Category>> = {
        [root.id]: root,
      };
      const rebuilds = sortedItems.map((item) => ({ ...item, children: [] }));

      for (const item of rebuilds) {
        const { id, children, ...prop } = item;
        const parentId = item.parent_id ?? root.id;
        const parent =
          nodes[parentId] ?? sortedItems.find(({ id }) => id === parentId);

        nodes[id] = { id, children, ...prop };
        parent.children.push(item);
      }

      setItems(root.children);

      const dataActive = active.data.current;

      if (dataActive?.parentId !== parentId) {
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

  const parents = useMemo(
    () => categories?.entities.map((cate) => cate.name),
    [categories],
  );

  return (
    <>
      <Combobox items={parents}>
        <ComboboxInput placeholder="Select a parent" />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => {
              return (
                <ComboboxItem
                  key={item}
                  value={item}
                  onSelect={(e) => {
                    console.log(e);
                  }}
                >
                  {item}
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
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
              state: FilterUtils.getSortState(
                query.orderBy,
                query.order,
                fieldSorts,
              ),
              primaryValue: filters.orderBy,
              primaryPlaceholder: t(LANG_KEY_CONST.COMMON_FIELD),
              primaryOptions: primaryOptions,
              onPrimaryChange: (value) => {
                const orderBy = value as keyof Category;
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
          ]}
        />
        <div className="py-2 px-4">
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
                    disabled={children.length > 0}
                    depth={
                      id === activeId && projected ? projected.depth : depth
                    }
                    indentationWidth={24}
                    text={name}
                    active={is_active}
                    collapsed={Boolean(collapsed && children.length)}
                    onCollapsed={
                      children.length ? () => handleCollapsed(id) : undefined
                    }
                  />
                ),
              )}
              <DragOverlay></DragOverlay>
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <CategoryCreateDialog isOpen={openCreate} onOpenChange={setOpenCreate} />
    </>
  );
};

export default CategoriesPage;
