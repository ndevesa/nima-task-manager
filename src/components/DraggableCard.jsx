import React, { useMemo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  Trash2,
  Pencil,
  CalendarIcon,
  AlarmClock,
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
import { Separator } from "@/components/ui/separator";

function PriorityIcon({ priority }) {
  // Usar title en vez de Tooltips pesados; componente memoizado al final por React.memo
  if (priority === "Alta")
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FlagTriangleRight className="w-4 h-4 text-red-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Alta Prioridad</p>
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
          <p>Media Prioridad</p>
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
          <p>Baja Prioridad</p>
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
        {task.tag && (
          <Badge className="mb-2 text-[10px] bg-gray-900 uppercase">
            {task.tag}
          </Badge>
        )}

        <h3 className="font-semibold text-sm pr-20">{task.content}</h3>
        {(() => {
          if (!task.description) return null;
          const words = task.description.split(" ");
          const truncated =
            words.length > 15
              ? words.slice(0, 15).join(" ") + "..."
              : task.description;
          return (
            <p className="text-sm text-white/70 mt-1 break-words line-clamp-3">
              {truncated}
            </p>
          );
        })()}

        <Separator className="my-3 bg-white/10" />

        <div className="flex justify-between items-center mt-3">
          {task.dueDate && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`flex items-center gap-1 cursor-help  ${
                    isNearDeadline ? "text-red-200" : "text-white/60"
                  }`}
                >
                  <AlarmClock size={14} />
                  <small>
                    Vence el
                    {format(new Date(task.dueDate), " dd/MM/yyyy", {
                      locale: es,
                    })}
                  </small>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {(() => {
                  const due = new Date(task.dueDate);
                  const today = new Date();
                  const diffDays = Math.ceil(
                    (due - today) / (1000 * 60 * 60 * 24)
                  );

                  if (diffDays < 0) return "Tarea vencida";
                  if (diffDays === 0) return "¡Vence hoy!";
                  if (isNearDeadline) return "¡Vence muy pronto!";
                  return `Faltan ${diffDays} día${diffDays > 1 ? "s" : ""}`;
                })()}
              </TooltipContent>
            </Tooltip>
          )}

          {task.subtasks && task.subtasks.length > 0 && (
            <p className="text-xs text-white/60">
              {task.subtasks.filter((st) => st.completed).length} /{" "}
              {task.subtasks.length} Subtareas
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
              className="p-0 md:p-1.5 rounded-full bg-blue-500/20 hover:bg-blue-500/40 cursor-pointer"
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
              className="p-0 md:p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 cursor-pointer"
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
