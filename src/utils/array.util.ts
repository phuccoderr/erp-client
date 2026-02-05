import type { UniqueIdentifier } from "@dnd-kit/core";

type TreeItem<T> = T & { id: number; parent_id: number | null };
export type ResultTreeItem<T> = TreeItem<T> & {
  depth: number;
  children: ResultTreeItem<T>[];
  collapsed: boolean;
};

export class ArrayUtils {
  static flattenTree<T>(items: ResultTreeItem<T>[]): ResultTreeItem<T>[] {
    const flatten = (
      items: ResultTreeItem<T>[],
      parentId: UniqueIdentifier | null = null,
      depth = 0,
    ): ResultTreeItem<T>[] => {
      return items.reduce<ResultTreeItem<T>[]>((acc, item, index) => {
        return [
          ...acc,
          { ...item, parentId, depth, index },
          ...flatten(item.children, item.id, depth + 1),
        ];
      }, []);
    };

    return flatten(items);
  }

  static buildTreeWithDepth<T>(items: TreeItem<T>[]) {
    const itemMap = new Map<number, ResultTreeItem<T>>();
    items.forEach((item) => {
      itemMap.set(item.id, {
        ...item,
        children: [],
        depth: 0,
        collapsed: false,
      });
    });

    const roots: ResultTreeItem<T>[] = [];

    items.forEach((item) => {
      const node = itemMap.get(item.id);

      if (node === undefined) {
        throw new Error(
          `Node with id ${item.id} not found in map (impossible state)`,
        );
      }

      if (item.parent_id === null) {
        roots.push(node);
      } else {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(node);
          node.depth = parent.depth + 1;
        }
      }
    });
    return roots;
  }

  static removeChildrenOf<T>(
    items: ResultTreeItem<T>[],
    ids: UniqueIdentifier[],
  ) {
    const excludeParentIds = [...ids];

    return items.filter((item) => {
      if (item.parent_id && excludeParentIds.includes(item.parent_id)) {
        if (item.children.length) {
          excludeParentIds.push(item.id);
        }
        return false;
      }

      return true;
    });
  }
}
