import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface NextStepItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

export function NextStepItem({
  id,
  text,
  completed,
  onToggle,
  onRemove,
}: NextStepItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-secondary/50 p-2 rounded-md"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </Button>

      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="h-4 w-4"
      />

      <span
        className={`flex-1 ${
          completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {text}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
