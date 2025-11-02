import React, { useState, useMemo } from "react";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  format,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, SquarePen } from "lucide-react";

export default function CalendarView({ tasks, onTaskClick, onCreateTask }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { locale: es });
  const calendarEnd = endOfWeek(monthEnd, { locale: es });

  const daysInMonth = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Alta":
        return "bg-red-500/80";
      case "Media":
        return "bg-yellow-500/80";
      case "Baja":
        return "bg-green-500/80";
      default:
        return "bg-blue-500/80";
    }
  };

  const tasksByDay = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        const day = format(new Date(t.dueDate), "yyyy-MM-dd");
        if (!map[day]) map[day] = [];
        map[day].push(t);
      }
    });
    return map;
  }, [tasks]);

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <div className="flex flex-col items-center w-full ">
      {/* Header del calendario */}
      <div className="flex justify-between items-center w-full mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-white/10 rounded-md transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-white capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-white/10 rounded-md transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Encabezado de días de la semana */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/60 mb-2 w-full">
        {weekDays.map((day, i) => (
          <div key={i} className="uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMonth.getMonth()}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-2 text-center text-sm w-full "
        >
          {daysInMonth.map((day) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const tasksForDay = tasksByDay[dayKey] || [];
            const isCurrentMonth =
              format(day, "MM") === format(currentMonth, "MM");

            const hasTasks = tasksForDay.length > 0;

            return (
              <div
                key={dayKey}
                className={`p-2 border border-white/10 relative rounded-lg min-h-[100px] transition group
                  ${
                    !isCurrentMonth
                      ? "opacity-20"
                      : hasTasks
                      ? "bg-white/5 hover:bg-white/10"
                      : "bg-white/5 opacity-40"
                  }`}
              >
                {/* Botón crear tarea */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateTask?.(day); // ← Pasar la fecha
                      }}
                      className="absolute bottom-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition"
                    >
                      <SquarePen className="w-4 h-4 text-white cursor-pointer" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Crear tarea para este día</p>
                  </TooltipContent>
                </Tooltip>

                <p className="text-white/70 text-xs mb-1">
                  {format(day, "d", { locale: es })}
                </p>

                {hasTasks &&
                  tasksForDay.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(task.id)}
                      className={`${getPriorityColor(
                        task.taskPriority
                      )} text-white text-xs rounded-md px-1 py-[2px] mb-1 truncate cursor-pointer hover:brightness-110 transition`}
                      title={task.content}
                    >
                      {task.title || task.content}
                    </div>
                  ))}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
