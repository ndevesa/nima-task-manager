import React, { useMemo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  Trash2,
  Pencil,
  CalendarIcon,
  FlagTriangleRight,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

function PriorityIcon({ priority }) {
  // Usar title en vez de Tooltips pesados; componente memoizado al final por React.memo
  if (priority === "Alta")
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FlagTriangleRight className="w-4 h-4 text-red-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Prioridad Alta</p>
        </TooltipContent>
      </Tooltip>
    );
  if (priority === "Media")
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FlagTriangleRight className="w-4 h-4 text-yellow-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Prioridad Media</p>
        </TooltipContent>
      </Tooltip>
    );
  if (priority === "Baja")
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FlagTriangleRight className="w-4 h-4 text-green-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Prioridad Baja</p>
        </TooltipContent>
      </Tooltip>
    );
  return null;
}

function DraggableCard({ task, onDeleteTask, onEdit }) {
  const icon = useMemo(
    () => <PriorityIcon priority={task.taskPriority} />,
    [task.taskPriority]
  );

  const isNearDeadline = useMemo(() => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) - new Date() < 3 * 24 * 60 * 60 * 1000;
  }, [task.dueDate]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "card",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    // hint al navegador
    willChange: isDragging ? "transform, opacity" : "auto",
  };

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      if (window.confirm(`¿Eliminar la tarea "${task.content}"?`)) {
        onDeleteTask(task.id);
      }
    },
    [onDeleteTask, task.id, task.content]
  );

  const handleEdit = useCallback(
    (e) => {
      e.stopPropagation();
      onEdit(task.id);
    },
    [onEdit, task.id]
  );

  return (
    <motion.div
      layout={!isDragging}
      initial={false}
      animate={{ opacity: isDragging ? 0.5 : 1 }}
      transition={{ duration: 0.15 }}
      ref={setNodeRef}
      style={style}
      className="bg-white/10 hover:bg-white/20 transition p-3 rounded-xl shadow border border-white/10 group relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <h3 className="font-semibold pr-20">{task.content}</h3>
        {task.description && (
          <p className="text-sm text-white/70 mt-1">{task.description}</p>
        )}

        {task.tag && (
          <Badge className="mt-3 text-[10px] uppercase">{task.tag}</Badge>
        )}

        <div className="flex justify-between items-center mt-4">
          {task.dueDate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <small
                  className={`flex items-center gap-2 text-xs ${
                    isNearDeadline ? "text-red-200" : "text-white/60"
                  }`}
                >
                  <CalendarIcon size={14} />

                  {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: es })}
                </small>
              </TooltipTrigger>
              <TooltipContent>
                {isNearDeadline ? "¡Vence pronto!" : "Fecha de vencimiento"}
              </TooltipContent>
            </Tooltip>
          )}

          {task.subtasks && task.subtasks.length > 0 && (
            <p className="text-xs text-white/60">
              {task.subtasks.filter((st) => st.completed).length} /{" "}
              {task.subtasks.length} Subtareas Completadas
            </p>
          )}

          {icon}
        </div>
      </div>

      {task.attachment_url && (
        <a
          href={task.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200 mt-2"
        >
          <Paperclip className="w-3 h-3" />
          <span className="truncate max-w-[150px]">
            {task.attachment_name || "Ver archivo"}
          </span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}

      <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleEdit}
              className="p-0 md:p-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/40"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleDelete}
              className="p-0 md:p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Eliminar</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}

// Memoizar el card: re-render sólo si cambia la referencia de task o handlers
export default React.memo(
  DraggableCard,
  (prev, next) =>
    prev.task === next.task &&
    prev.onDeleteTask === next.onDeleteTask &&
    prev.onEdit === next.onEdit
);
