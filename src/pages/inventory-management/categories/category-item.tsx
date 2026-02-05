import { Badge, Button, Typography } from "@components/ui";
import { useSortable, type AnimateLayoutChanges } from "@dnd-kit/sortable";
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
  id: number;
  parentId: number | null;
  active?: boolean;
  disabled: boolean;
  depth: number;
  indentationWidth: number;
  text: string;
  collapsed?: boolean;
  onCollapsed?: () => void;
}

export function CategoryItem({
  id,
  active,
  parentId,
  depth,
  disabled = false,
  indentationWidth = 50,
  text,
  collapsed,
  onCollapsed,
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
    disabled,
    data: { parentId, depth },
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
      className={`
        list-none box-border
        ${isDragging ? "relative z-1 mb-px" : ""}
      `}
    >
      <div
        style={style}
        className={cn(
          `border rounded-sm mt-px py-2 px-4 h-8 flex items-center`,
          isDragging &&
            "relative px-0 py-0 h-2 border-blue-300 bg-blue-500 rounded-lg *:opacity-0 *:h-0",
        )}
      >
        <Button className="mr-1" variant="soft" size="icon-xs">
          <Package />
        </Button>

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
        {!disabled && (
          <Button {...attributes} {...listeners} variant="ghost" size="icon-xs">
            <GripVertical />
          </Button>
        )}
        <Typography className="mx-1">{text}</Typography>

        <div className="flex items-center ml-auto gap-1">
          <Badge variant="soft-green">{active ? "active" : "non-active"}</Badge>
          <Button variant="ghost" size="icon-xs">
            <Plus />
          </Button>
          <Button variant="ghost" size="icon-xs">
            <SquarePen />
          </Button>
          <Button size="icon-xs" variant="ghost">
            <Trash2 />
          </Button>
        </div>
      </div>
    </li>
  );
}
