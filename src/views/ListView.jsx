import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Paperclip, CheckSquare, Trash2 } from "lucide-react";
import TaskDialog from "@/components/TaskDialog";
import CustomizeDialog from "@/components/CustomizeDialog";
import InfoDialog from "@/components/InfoDialog";
import CalendarView from "@/components/CalendarView";

export default function ListView({
  handleDeleteColumn,
  handleOpenNewTaskWithDate,
  isCustomizeDialogOpen,
  setIsCustomizeDialogOpen,
  isInfodialogOpen,
  setIsInfodialogOpen,
  isCalendarOpen,
  setIsCalendarOpen,
  columnsToRender,
  filters,
  handleEditTask,
  isDialogOpen,
  setIsDialogOpen,
  editingTaskId,
  setEditingTaskId,
  formData,
  setFormData,
  onSaveTask,
  handleDeleteTask,
  data,
  priorities,
}) {
  return (
    <div
      id="Main"
      className="flex-1 flex flex-col text-white transition-all duration-300"
    >
      <div className="flex-1 w-full flex flex-col gap-6 overflow-y-auto shadow-xl">
        {columnsToRender
          .filter(
            ({ column }) =>
              filters.column === "Todas" || column.id === filters.column
          )
          .map(({ column, tasks }) => {
            function truncateWords(text, maxWords = 20) {
              if (!text) return "";
              const words = text.split(" ");
              return words.length > maxWords
                ? words.slice(0, maxWords).join(" ") + "..."
                : text;
            }
            // ---- Filtrado de tareas como en BoardView ----
            const filteredTasks = tasks
              .map((task) => {
                const matchQuery =
                  filters.query === "" ||
                  task.content
                    .toLowerCase()
                    .includes(filters.query.toLowerCase()) ||
                  task.description
                    ?.toLowerCase()
                    .includes(filters.query.toLowerCase());

                const matchPriority =
                  !filters.priority ||
                  filters.priority === "Todas" ||
                  task.taskPriority === filters.priority;

                return {
                  ...task,
                  visible: matchQuery && matchPriority,
                };
              })
              .filter((t) => t.visible);

            return (
              <div
                key={column.id}
                className="bg-white/5 rounded-2xl border border-white/10 p-3"
              >
                <div className="flex justify-between gap-5 items-center mb-3">
                  <h2 className="text-xl font-semibold text-white/90">
                    {column.title}
                  </h2>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        window.confirm(
                          `¿Eliminar la columna "${column.title}"? Se eliminarán tambien las tareas asociadas. Ésta acción es irreversible.`
                        )
                      ) {
                        handleDeleteColumn(column.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 cursor-pointer"
                    title="Eliminar Columna"
                  >
                    <Trash2 className="w-3 h-3 text-red-300" />
                  </button>
                </div>

                <div className="rounded-md border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/20">
                      <TableRow className="bg-white/20 hover:bg-white/20">
                        <TableHead className="text-white/70">Tarea</TableHead>
                        <TableHead className="text-white/70">
                          Descripción
                        </TableHead>
                        <TableHead className="text-white/70 ">
                          Prioridad
                        </TableHead>
                        <TableHead className="text-white/70">
                          Vencimiento
                        </TableHead>
                        <TableHead className="text-white/70">
                          Etiqueta
                        </TableHead>
                        <TableHead className="text-white/70">
                          Subtareas
                        </TableHead>
                        <TableHead className="text-white/70">Adjunto</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="backdrop-blur-lg">
                      {filteredTasks.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-white/40"
                          >
                            No hay tareas en esta columna.
                          </TableCell>
                        </TableRow>
                      )}

                      {filteredTasks.map((task) => (
                        <TableRow
                          key={task.id}
                          className="cursor-pointer hover:bg-white/10 transition text-white/70 hover:text-white"
                          onClick={() => handleEditTask(task.id)}
                        >
                          <TableCell className="max-w-[150px]">
                            {task.content}
                          </TableCell>

                          <TableCell className="max-w-[150px] truncate">
                            {truncateWords(task.description, 5) || "-"}
                          </TableCell>

                          <TableCell className="capitalize">
                            {task.taskPriority || "-"}
                          </TableCell>

                          <TableCell>
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString()
                              : "-"}
                          </TableCell>

                          <TableCell className="uppercase">
                            {task.tag || "-"}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1 text-white/70">
                              <CheckSquare className="w-4 h-4" />
                              {task.subtasks?.length
                                ? `${
                                    task.subtasks.filter((s) => s.done).length
                                  }/${task.subtasks.length}`
                                : "0/0"}
                            </div>
                          </TableCell>

                          <TableCell>
                            {task.attachment_url ? (
                              <Paperclip className="w-4 h-4" />
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}

        {/* DIALOGS */}
        <CustomizeDialog
          open={isCustomizeDialogOpen}
          setOpen={setIsCustomizeDialogOpen}
        />
        <InfoDialog
          isOpen={isInfodialogOpen}
          onClose={() => setIsInfodialogOpen(false)}
        />

        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent className="dialog-wide bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Modo Calendario</DialogTitle>
              <DialogDescription className="text-white/70">
                Visualizá tus tareas según la fecha de vencimiento.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 h-full overflow-y-auto overflow-x-hidden">
              <CalendarView
                tasks={Object.values(data.tasks)}
                onTaskClick={(taskId) => handleEditTask(taskId)}
                onCreateTask={handleOpenNewTaskWithDate}
              />
            </div>
          </DialogContent>
        </Dialog>

        <TaskDialog
          isOpen={isDialogOpen}
          setIsOpen={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setTimeout(() => {
                setEditingTaskId(null);
                setFormData({
                  title: "",
                  description: "",
                  category: undefined,
                  dueDate: null,
                  taskPriority: "",
                  subtasks: [],
                  tag: "",
                  attachment_url: null,
                  attachment_name: null,
                  attachment_type: null,
                });
              }, 200);
            }
          }}
          editingTaskId={editingTaskId}
          formData={formData}
          setFormData={setFormData}
          onSaveTask={onSaveTask}
          handleDeleteTask={handleDeleteTask}
          data={data}
          priorities={priorities}
        />
      </div>
    </div>
  );
}
