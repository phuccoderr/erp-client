import { Badge, Button, Typography } from "@components/ui";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@lib";
import {
  ChevronRight,
  GripVertical,
  Minus,
  Package,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";

interface CategoryItemProps {
  id: number | UniqueIdentifier;
  parentId: number | null;
  clone?: boolean;
  active?: boolean;
  depth: number;
  indentationWidth?: number;
  text: string;
  collapsed?: boolean;
  onCollapsed?: () => void;
  onOpenCreate?: (id: number) => void;
  onOpenUpdate?: (id: number) => void;
  onOpenDelete?: (id: number) => void;
}

export function CategoryItem({
  id,
  active,
  parentId,
  clone,
  depth,
  indentationWidth = 24,
  text,
  collapsed,
  onCollapsed,
  onOpenCreate,
  onOpenUpdate,
  onOpenDelete,
}: CategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { parent_id: parentId, depth },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={{
        paddingLeft: `${indentationWidth * depth}px`,
      }}
      className={cn(
        "list-none box-border",
        isDragging ? "relative z-1 mb-px" : "",
        clone && "inline-block pointer-events-none",
      )}
    >
      <div
        style={style}
        className={cn(
          `border rounded-sm mt-px py-2 px-4 h-8 flex items-center`,
          isDragging &&
            "relative px-0 py-0 h-2 border-blue-300 bg-blue-500 rounded-lg *:opacity-0 *:h-0",
          clone && "bg-background opacity-75 py-2 px-4",
        )}
      >
        <Button className="mr-1" variant="soft" size="icon-xs">
          <Package />
        </Button>

        {!clone && (
          <Button variant="ghost" size="icon-xs" onClick={onCollapsed}>
            <motion.div
              initial={false}
              animate={{ rotate: collapsed || !onCollapsed ? 0 : 90 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              {onCollapsed ? <ChevronRight /> : <Minus />}
            </motion.div>
          </Button>
        )}
        {!clone && (
          <Button {...attributes} {...listeners} variant="ghost" size="icon-xs">
            <GripVertical />
          </Button>
        )}
        <Typography className="mx-1">{text}</Typography>

        {!clone && (
          <div className="flex items-center ml-auto gap-1">
            <Badge variant="soft-green">
              {active ? "active" : "non-active"}
            </Badge>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onOpenCreate?.(Number(id))}
            >
              <Plus />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onOpenUpdate?.(Number(id))}
            >
              <SquarePen />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => onOpenDelete?.(Number(id))}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
