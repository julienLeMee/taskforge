import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, Ellipsis, Video, GripVertical } from "lucide-react";
import { Task } from "../types";
import { TableCell, TableRow } from "@/components/ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskRowProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onPriorityChange: (taskId: string, newPriority: Task["priority"]) => void;
  onTimeframeChange: (taskId: string, newTimeframe: Task["timeframe"]) => void;
  onTaskDoneChange: (taskId: string, isDone: boolean) => void;
  onUpdateTask: (taskId: string, task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskRow({
  task,
  onStatusChange,
  onPriorityChange,
  onTimeframeChange,
  onTaskDoneChange,
  onUpdateTask,
  onDeleteTask,
}: TaskRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={`${task.isDone ? "bg-muted" : ""} ${isDragging ? "z-50" : ""}`}>
        <TableCell className={`${
        task.isSupport ? "border-l-2 border-primary" :
        task.isMeeting ? "border-l-2 dark:border-secondary border-foreground" : ""
      }`}>
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab hover:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        <Checkbox
          id={task.id}
          checked={task.isDone}
          onCheckedChange={(checked) => onTaskDoneChange(task.id, checked as boolean)}
        />
        </div>
      </TableCell>
      <TableCell className={`font-medium ${task.isDone ? "line-through" : ""}`}>
        <span onClick={() => onUpdateTask(task.id, task)} className="cursor-pointer hover:underline">
        {task.isMeeting ? (
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            {task.title}
          </div>
        ) : task.title}
        </span>
      </TableCell>
      <TableCell>
        {task.isMeeting ? ("-") : task.status ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                className="cursor-pointer hover:opacity-80"
                variant={
                  task.status === "COMPLETED" ? "default" :
                  task.status === "IN_PROGRESS" ? "secondary" :
                  task.status === "WAITING" ? "outline" :
                  task.status === "TODO" ? "primary" : "destructive"
                }
              >
                {task.status === "TODO" ? "À faire" :
                 task.status === "IN_PROGRESS" ? "En cours" :
                 task.status === "WAITING" ? "En attente" : "Terminé"}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "TODO")}>
                <Badge variant="primary">À faire</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "IN_PROGRESS")}>
                <Badge variant="secondary">En cours</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "WAITING")}>
                <Badge variant="outline">En attente</Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </TableCell>
      <TableCell className={`${task.isDone ? "line-through" : ""}`}>
        {task.isMeeting ? ("-") : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer hover:underline">
                {task.timeframe ? (
                  task.timeframe === "TODAY" ? "Aujourd'hui" :
                  task.timeframe === "THIS_WEEK" ? "Cette semaine" :
                  "À venir"
                ) : "Choisir une échéance"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onTimeframeChange(task.id, "TODAY")}>
                Aujourd&apos;hui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTimeframeChange(task.id, "THIS_WEEK")}>
                Cette semaine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTimeframeChange(task.id, "UPCOMING")}>
                À venir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
      <TableCell>
        {task.isMeeting ? ("-") : task.priority ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                className="cursor-pointer hover:opacity-80"
                variant={
                  task.priority === "LOW" ? "outline" :
                  task.priority === "MEDIUM" ? "secondary" :
                  task.priority === "HIGH" ? "default" : "destructive"
                }
              >
                {task.priority === "LOW" ? "Basse" :
                 task.priority === "MEDIUM" ? "Moyenne" :
                 task.priority === "HIGH" ? "Haute" : "Urgente"}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onPriorityChange(task.id, "LOW")}>
                <Badge variant="outline">Basse</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPriorityChange(task.id, "MEDIUM")}>
                <Badge variant="secondary">Moyenne</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPriorityChange(task.id, "HIGH")}>
                <Badge variant="default">Haute</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPriorityChange(task.id, "URGENT")}>
                <Badge variant="destructive">Urgente</Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdateTask(task.id, task)} className="cursor-pointer">
              <Pencil className="h-4 w-4" />
              <span className="">Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteTask(task.id)} className="cursor-pointer">
              <Trash2 className="h-4 w-4" />
              <span className="">Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
