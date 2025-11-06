import React, { useState } from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripHorizontal, SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import DraggableCard from "./DraggableCard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createTaskDB } from "@/lib/BoardLogic";

function DraggableColumn({
  column,
  tasks,
  onDeleteTask,
  onEditTask,
  onDeleteColumn,
  onUpdateTitle,
  setFormData,
  setEditingTaskId,
  setIsDialogOpen,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 0.95,
    willChange: isDragging ? "transform, opacity" : "auto",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full min-w-[300px] md:w-[380px] md:min-w-[380px] bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-4 pt-2 shadow-xl"
    >
      {/* Header de la columna */}
      <div className="flex justify-center cursor-grab">
        <GripHorizontal className="text-white/70 size-4" />
      </div>

      <div className="group mb-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex justify-between items-center"
        >
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                if (editTitle.trim()) {
                  onUpdateTitle(column.id, editTitle);
                } else {
                  setEditTitle(column.title);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="text-lg font-semibold capitalize bg-white/20 border border-white/40 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h2
              className="text-lg font-semibold capitalize select-none cursor-text flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              {column.title}{" "}
              {tasks.length > 0 && (
                <div className="backdrop-blur-3xl text-center rounded-full text-xs text-white/50 w-5 h-5">
                  <small>{tasks.length}</small>
                </div>
              )}
            </h2>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  `¿Eliminar la columna "${column.title}"? Se eliminarán tambien las tareas asociadas. Ésta acción es irreversible.`
                )
              ) {
                onDeleteColumn(column.id);
              }
            }}
            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>

      {/* Cada columna tiene su propio SortableContext */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`transition-opacity duration-300 ${
                task.visible ? "opacity-100" : "opacity-30 pointer-events-none"
              }`}
            >
              <DraggableCard
                task={task}
                onDeleteTask={(taskId) => onDeleteTask(taskId)}
                onEdit={onEditTask}
              />
            </div>
          ))}
        </div>
      </SortableContext>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                category: column.id,
                dueDate: null,
                taskPriority: "",
                subtasks: [],
                tag: "",
              });
              setEditingTaskId(null);
              setIsDialogOpen(true);
            }}
            className={`opacity-30 hover:opacity-100 border border-white/20 bg-transparent hover:bg-transparent hover:text-white/80 text-xs cursor-pointer 
    ${tasks.length > 0 ? "mt-5" : ""}`}
            size="sm"
          >
            <SquarePen className="w-2 h-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Nueva Tarea</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// Memoización con comparación personalizada para evitar re-renders
export default React.memo(DraggableColumn, (prev, next) => {
  // comparar título
  if (prev.column.title !== next.column.title) return false;
  // comparar taskIds (orden y contenido)
  const prevIds = prev.column.taskIds || [];
  const nextIds = next.column.taskIds || [];
  if (prevIds.length !== nextIds.length) return false;
  for (let i = 0; i < prevIds.length; i++) {
    if (prevIds[i] !== nextIds[i]) return false;
  }
  // comparar tasks por referencia (si mismos objetos => no re-render)
  const pTasks = prev.tasks || [];
  const nTasks = next.tasks || [];
  if (pTasks.length !== nTasks.length) return false;
  for (let i = 0; i < pTasks.length; i++) {
    if (pTasks[i] !== nTasks[i]) return false;
  }
  // handlers suelen ser estables (useCallback), si cambian, forzamos re-render
  return (
    prev.onDeleteTask === next.onDeleteTask &&
    prev.onEditTask === next.onEditTask &&
    prev.onDeleteColumn === next.onDeleteColumn &&
    prev.onUpdateTitle === next.onUpdateTitle
  );
});
