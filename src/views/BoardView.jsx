import React from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import CalendarView from "@/components/CalendarView";
import CustomizeDialog from "@/components/CustomizeDialog";
import TaskDialog from "@/components/TaskDialog";
import InfoDialog from "@/components/InfoDialog";
import DraggableColumn from "@/components/DraggableColumn";

export default function BoardView({
  sensors,
  isDragging,
  columnsToRender,
  filters,
  handleDragStart,
  handleDragEnd,
  handleDragCancel,
  handleDeleteTask,
  handleEditTask,
  handleDeleteColumn,
  handleUpdateColumnTitle,
  setFormData,
  setEditingTaskId,
  setIsDialogOpen,
  data,
  priorities,
  isCustomizeDialogOpen,
  setIsCustomizeDialogOpen,
  isInfodialogOpen,
  setIsInfodialogOpen,
  isDialogOpen,
  formData,
  editingTaskId,
  onSaveTask,
  isCalendarOpen,
  setIsCalendarOpen,
  handleOpenNewTaskWithDate,
  activeId,
  activeType,
  activeTask,
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        id="Main"
        className={`flex-1 flex flex-col text-white transition-all duration-300 ${
          isDragging ? "is-dragging" : ""
        }`}
      >
        {/* TABLERO PRINCIPAL */}
        <div className="flex-1 w-full p-3 flex gap-4 overflow-x-auto bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <SortableContext
            items={data.columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {columnsToRender
              .filter(
                ({ column }) =>
                  filters.column === "Todas" || column.id === filters.column
              )
              .map(({ column, tasks }) => {
                const filteredTasks = tasks.map((task) => {
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
                });

                return (
                  <DraggableColumn
                    key={column.id}
                    column={column}
                    tasks={filteredTasks}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={handleEditTask}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateTitle={handleUpdateColumnTitle}
                    setFormData={setFormData}
                    setEditingTaskId={setEditingTaskId}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                );
              })}
          </SortableContext>
        </div>

        {/* DIALOGS */}
        <CustomizeDialog
          open={isCustomizeDialogOpen}
          setOpen={setIsCustomizeDialogOpen}
        />
        <InfoDialog
          isOpen={isInfodialogOpen}
          onClose={() => setIsInfodialogOpen(false)}
        />
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

        {/* CALENDAR */}
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

        {/* DRAG OVERLAY */}
        <DragOverlay dropAnimation={null}>
          {activeId && activeType === "card" && activeTask ? (
            <div className="bg-white/10 p-2 rounded-md border border-white/10 text-black w-60">
              <h3 className="block font-semibold truncate">
                {activeTask.content}
              </h3>
              {activeTask.description && (
                <p className="text-sm truncate">{activeTask.description}</p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
