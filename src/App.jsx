import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
import { useAuth } from "./context/AuthContext";
import { supabase } from "./lib/supabaseClient";

import { bgImages } from "./constants/backgrounds";
import initialData from "./data/initialData";
import * as BoardLogic from "./lib/BoardLogic";

import Header from "./components/Header";
import DraggableColumn from "./components/DraggableColumn";
import Login from "@/components/Login";
import CalendarView from "@/components/CalendarView";
import CustomizeDialog from "@/components/CustomizeDialog";
import TaskDialog from "@/components/TaskDialog";
import InfoDialog from "@/components/InfoDialog";
import WelcomeMessage from "@/components/WelcomeMessage";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  // ---- AUTENTICACIÓN ----
  const { user, loading } = useAuth();
  const userName = user?.user_metadata?.fullname || user?.email?.split("@")[0];

  // ---- ESTADOS PRINCIPALES ----
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInfodialogOpen, setIsInfodialogOpen] = useState(false);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    priority: undefined,
    column: "Todas",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: undefined,
    dueDate: null,
    taskPriority: "",
    subtasks: [],
    tag: "",
    attachment_name: null,
    attachment_url: null,
    attachment_type: null,
  });
  const priorities = ["Alta", "Media", "Baja"];

  // ---- REFS ----
  const formRef = useRef(formData);
  const dataRef = useRef(data);
  const editingTaskIdRef = useRef(editingTaskId);

  // ---- EFECTS ----
  useEffect(() => {
    bgImages.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  useEffect(() => {
    formRef.current = formData;
  }, [formData]);

  useEffect(() => {
    dataRef.current = data;

    if (BoardLogic && typeof BoardLogic.saveToLocalStorage === "function") {
      try {
        BoardLogic.saveToLocalStorage(data);
      } catch (e) {
        console.warn("Error guardando en localStorage:", e);
      }
    }
  }, [data]);

  useEffect(() => {
    editingTaskIdRef.current = editingTaskId;
  }, [editingTaskId]);

  // ---- CARGA INICIAL DE DATOS ----
  useEffect(() => {
    async function ensureUserProfile(userId) {
      try {
        const { data: existing, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", userId)
          .maybeSingle();

        if (fetchError) {
          console.error("Error verificando perfil:", fetchError);
          return;
        }

        if (!existing) {
          const { error: insertError } = await supabase
            .from("profiles")
            .insert([{ id: userId, background: null }]);

          if (insertError) {
            console.error("Error creando perfil:", insertError);
          } else {
            console.log("✅ Perfil creado correctamente");
          }
        }
      } catch (err) {
        console.error("Error en ensureUserProfile:", err);
      }
    }

    // 🔹 Aplica el fondo guardado del perfil
    async function applyUserBackground(userId) {
      const { data, error } = await supabase
        .from("profiles")
        .select("background")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error cargando background:", error);
        return;
      }

      if (data?.background) {
        const bg = data.background;

        if (bg.startsWith("http")) {
          document.body.style.backgroundImage = `url(${bg})`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundColor = "";
        } else {
          document.body.style.backgroundImage = "none";
          document.body.style.backgroundColor = bg;
        }
      }
    }

    if (hasLoadedInitialData || !user || isDemoMode) {
      if (!user) setLoadingData(false);
      return;
    }

    // 🔹 Carga inicial de datos
    const fetchData = async () => {
      setLoadingData(true); // ← Agregar esto al inicio

      try {
        await ensureUserProfile(user.id);

        const userData = await BoardLogic.loadUserData(user.id);

        if (userData && Object.keys(userData.tasks).length > 0) {
          setData(userData);
          await applyUserBackground(user.id);
        } else {
          // Usuario nuevo o sin datos
          setIsDemoMode(true);
          localStorage.setItem("demo-mode", "true");
          setData(initialData);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setIsDemoMode(true);
        setData(initialData);
      } finally {
        setLoadingData(false);
        setHasLoadedInitialData(true);
      }
    };

    fetchData();
  }, [user, hasLoadedInitialData, isDemoMode]);

  // ---- DND Sensors ----
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 2 } })
  );

  // ---- HANDLERS (TODOS LOS useCallback DEBEN IR ANTES DE LOS RETURNS) ----
  const handleLoadDemo = useCallback(() => {
    setIsDemoMode(true);
    setData(initialData);
  }, []);

  const handleLoadRealData = useCallback(async () => {
    setIsDemoMode(false);
    setLoadingData(true);

    try {
      const userData = await BoardLogic.loadUserData(user.id);
      setData(userData || initialData);
    } catch (err) {
      console.error("Error cargando datos reales:", err);
      setData(initialData);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  const handleEditTask = useCallback((taskId) => {
    BoardLogic.editTask(
      taskId,
      dataRef.current,
      setFormData,
      setEditingTaskId,
      setIsDialogOpen
    );
  }, []);

  const onSaveTask = useCallback(
    async (attachmentFile) => {
      await BoardLogic.handleSaveTask(
        data,
        formData,
        setData,
        editingTaskId,
        setEditingTaskId,
        setIsDialogOpen,
        setFormData,
        user,
        attachmentFile
      );
    },
    [
      data,
      formData,
      editingTaskId,
      setData,
      setEditingTaskId,
      setIsDialogOpen,
      setFormData,
      user,
    ]
  );

  const handleDeleteTask = useCallback(
    (taskId) => BoardLogic.deleteTask(dataRef.current, taskId, setData, user),
    [setData, user]
  );

  const handleDeleteColumn = useCallback(
    (colId) => BoardLogic.deleteColumn(dataRef.current, colId, setData, user),
    [setData, user]
  );

  const handleUpdateColumnTitle = useCallback(
    (colId, newTitle) =>
      BoardLogic.updateColumnTitle(
        dataRef.current,
        colId,
        newTitle,
        setData,
        user
      ),
    [setData, user]
  );

  const handleAddNewColumn = useCallback(
    () => BoardLogic.addNewColumn(dataRef.current, setData, user),
    [setData, user]
  );

  const handleExport = useCallback(() => {
    const json = BoardLogic.exportData(dataRef.current);
    alert("Se exportaron datos en formato JSON");
    return json;
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          setData(importedData);
          alert("✅ Datos importados exitosamente!");
        } catch (error) {
          alert("❌ Error al importar. Archivo inválido.");
        }
      };

      reader.readAsText(file);
    };

    input.click();
  }, []);

  const handleOpenNewTask = useCallback(() => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      category: undefined,
      dueDate: null,
      subtasks: [],
      tag: "",
      attachment_name: null,
      attachment_url: null,
      attachment_type: null,
      taskPriority: null,
    });
    setIsDialogOpen(true);
  }, [setEditingTaskId, setFormData, setIsDialogOpen]);

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveType(active.data.current?.type);
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      setActiveType(null);
      setIsDragging(false);
      return;
    }

    setData((prevData) => {
      const isColumnDrag = prevData.columnOrder.includes(active.id);

      if (isColumnDrag) {
        const oldIndex = prevData.columnOrder.indexOf(active.id);
        const newIndex = prevData.columnOrder.indexOf(over.id);
        return {
          ...prevData,
          columnOrder: arrayMove(prevData.columnOrder, oldIndex, newIndex),
        };
      }

      const activeColumnId = Object.keys(prevData.columns).find((colId) =>
        prevData.columns[colId].taskIds.includes(active.id)
      );
      if (!activeColumnId) return prevData;

      let overColumnId;
      if (prevData.columnOrder.includes(over.id)) {
        overColumnId = over.id;
      } else {
        overColumnId = Object.keys(prevData.columns).find((colId) =>
          prevData.columns[colId].taskIds.includes(over.id)
        );
      }
      if (!overColumnId) return prevData;

      if (activeColumnId === overColumnId) {
        const column = prevData.columns[activeColumnId];
        const oldIndex = column.taskIds.indexOf(active.id);
        const newIndex = column.taskIds.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) return prevData;
        const newTaskIds = arrayMove(column.taskIds, oldIndex, newIndex);
        return {
          ...prevData,
          columns: {
            ...prevData.columns,
            [activeColumnId]: { ...column, taskIds: newTaskIds },
          },
        };
      } else {
        const activeColumn = prevData.columns[activeColumnId];
        const overColumn = prevData.columns[overColumnId];
        const activeTaskIds = activeColumn.taskIds.filter(
          (id) => id !== active.id
        );

        let overTaskIds;
        if (prevData.columnOrder.includes(over.id)) {
          overTaskIds = [...overColumn.taskIds, active.id];
        } else {
          const overIndex = overColumn.taskIds.indexOf(over.id);
          overTaskIds = [...overColumn.taskIds];
          overTaskIds.splice(overIndex, 0, active.id);
        }

        return {
          ...prevData,
          columns: {
            ...prevData.columns,
            [activeColumnId]: { ...activeColumn, taskIds: activeTaskIds },
            [overColumnId]: { ...overColumn, taskIds: overTaskIds },
          },
        };
      }
    });

    setActiveId(null);
    setActiveType(null);
    setIsDragging(false);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveType(null);
    setIsDragging(false);
  }, []);

  const getActiveTask = useCallback(() => {
    if (!activeId || activeType !== "card") return null;
    const cols = dataRef.current.columns;
    for (const colId of Object.keys(cols)) {
      const taskIds = cols[colId].taskIds;
      if (taskIds.includes(activeId)) {
        return dataRef.current.tasks[activeId];
      }
    }
    return null;
  }, [activeId, activeType]);

  const handleOpenNewTaskWithDate = useCallback((date) => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      category: undefined,
      dueDate: date,
      taskPriority: null,
      tag: "",
      subtasks: [],
      attachment_name: null,
      attachment_url: null,
      attachment_type: null,
    });
    setIsDialogOpen(true);
  }, []);

  // ---- MEMOIZACIONES ----
  const columnsToRender = useMemo(() => {
    if (!data || !data.columns || !data.columnOrder) return [];

    return data.columnOrder.map((colId) => {
      const column = data.columns[colId];
      const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
      return { column, tasks };
    });
  }, [data]); // ← Cambiar a solo [data]

  // ---- RENDER CONDICIONAL ANTES DE USAR getActiveTask ----

  if (!user) {
    return <Login />;
  }

  // ← AHORA sí llamar getActiveTask DESPUÉS de validar data
  const activeTask = getActiveTask();

  if (loading || loadingData || !data) {
    return <LoadingScreen />;
  }

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
        className={`min-h-screen text-white flex flex-col w-full ${
          isDragging ? "is-dragging" : ""
        }`}
      >
        <Header
          userName={userName}
          data={data}
          setData={setData}
          initialData={initialData}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
          handleLoadRealData={handleLoadRealData}
          handleLoadDemo={handleLoadDemo}
          handleOpenNewTask={handleOpenNewTask}
          handleAddNewColumn={handleAddNewColumn}
          handleExport={handleExport}
          handleImport={handleImport}
          setIsCalendarOpen={setIsCalendarOpen}
          setIsCustomizeDialogOpen={setIsCustomizeDialogOpen}
          setIsInfodialogOpen={setIsInfodialogOpen}
          setFilters={setFilters}
        />

        <WelcomeMessage user={user} data={data} />

        <main className="flex-1 w-full p-3 flex gap-6 overflow-x-auto bg-white/5 rounded-2xl border border-white/10 shadow-xl">
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
                    !filters.priority || // ← undefined = muestra todas
                    filters.priority === "Todas" ||
                    task.taskPriority === filters.priority;

                  return { ...task, visible: matchQuery && matchPriority };
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
                  />
                );
              })}
          </SortableContext>
        </main>

        <footer className="text-center w-full py-2">
          <small className="mb-0 text-gray-400">
            <a href="https://www.nicolasdev.com/">www.nicolasdev.com</a>
          </small>
        </footer>

        {/*PERSONALIZAR DIALOG*/}
        <CustomizeDialog
          open={isCustomizeDialogOpen}
          setOpen={setIsCustomizeDialogOpen}
        />

        {/* INFO DIALOG */}
        <InfoDialog
          isOpen={isInfodialogOpen}
          onClose={() => setIsInfodialogOpen(false)}
        />

        {/* CREAR-EDITAR TAREA */}
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

        {/* VISTA CALENDAR DIALOG */}
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <DialogContent className="dialog-wide bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-2xl h-[90vh] overflow-hidden">
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
