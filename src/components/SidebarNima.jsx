import { useState, useEffect, memo, useCallback } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  SquarePen,
  Columns2,
  CalendarDays,
  PencilIcon,
  CircleQuestionMark,
  LogOut,
  Download,
  Plus,
  Trash2,
  ClipboardList,
  Edit2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ExportConfirmDialog } from "./ExportConfirmDialog";
import { CreateBoardDialog } from "./CreateBoardDialog";
import { DeleteBoardDialog } from "./DeleteBoardDialog";
import { EditBoardDialog } from "./EditBoardDialog";
import * as BoardLogic from "@/lib/BoardLogic";
import { exportData } from "@/lib/exportData";

const SidebarNima = memo(function SidebarNima({
  user,
  userName,
  currentBoardId,
  onBoardChange,
  handleOpenNewTask,
  handleAddNewColumn,
  setIsCalendarOpen,
  setIsCustomizeDialogOpen,
  setIsInfodialogOpen,
}) {
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [boardToEdit, setBoardToEdit] = useState(null);

  const handleExport = useCallback(async () => {
    if (!currentBoardId) {
      console.error("No hay tablero seleccionado");
      return;
    }

    try {
      const { data: columns, error: columnsError } = await supabase
        .from("columns")
        .select("*")
        .eq("board_id", currentBoardId)
        .order("position");

      if (columnsError) throw columnsError;

      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select("*")
        .in(
          "column_id",
          columns.map((col) => col.id)
        )
        .order("position");

      if (tasksError) throw tasksError;

      // Transformar a la estructura que espera exportData
      const formattedData = {
        columns: {},
        tasks: {},
      };

      // Agregar tasks al objeto
      tasks.forEach((task) => {
        formattedData.tasks[task.id] = {
          content: task.title,
          description: task.description,
          taskPriority: task.priority,
          dueDate: task.dueDate,
        };
      });

      // Agregar columns con sus taskIds
      columns.forEach((column) => {
        const columnTasks = tasks.filter((t) => t.column_id === column.id);
        formattedData.columns[column.id] = {
          title: column.title,
          taskIds: columnTasks.map((t) => t.id),
        };
      });

      if (tasks.length > 0) {
        exportData(formattedData);
        setShowExportDialog(false);
      } else {
        alert("No hay datos para exportar.");
      }
    } catch (error) {
      console.error("Error al exportar tablero:", error);
    }
  }, [currentBoardId]);

  // 🔹 Cargar boards del usuario - SOLO UNA VEZ
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    async function loadBoards() {
      setLoadingBoards(true);
      try {
        const userBoards = await BoardLogic.loadUserBoards(user.id);

        if (!isMounted) return;

        setBoards(userBoards);

        // Si no hay board seleccionado, seleccionar el primero
        if (!currentBoardId && userBoards.length > 0) {
          onBoardChange(userBoards[0].id);
        }
      } catch (error) {
        console.error("Error cargando boards:", error);
      } finally {
        if (isMounted) {
          setLoadingBoards(false);
        }
      }
    }

    loadBoards();

    // Cleanup para evitar actualizaciones en componente desmontado
    return () => {
      isMounted = false;
    };
  }, [user?.id]); // Solo depende del ID del usuario

  // 🔹 Crear nuevo board
  const handleCreateBoard = useCallback(
    async (title) => {
      if (creatingBoard) return;

      setCreatingBoard(true);
      try {
        const newBoard = await BoardLogic.createBoard(user.id, title);
        setBoards((prev) => [...prev, newBoard]);
        setShowCreateDialog(false);
        onBoardChange(newBoard.id);
      } catch (error) {
        console.error("Error creando board:", error);
        alert(error.message || "Error al crear el tablero");
      } finally {
        setCreatingBoard(false);
      }
    },
    [user?.id, onBoardChange, creatingBoard]
  );

  // 🔹 Iniciar edición de board
  const handleEditClick = useCallback((e, board) => {
    e.stopPropagation();
    setBoardToEdit(board);
    setShowEditDialog(true);
  }, []);

  // 🔹 Confirmar edición
  const handleConfirmEdit = useCallback(
    async (newTitle) => {
      if (!boardToEdit) return;

      try {
        await BoardLogic.renameBoard(boardToEdit.id, user.id, newTitle);

        setBoards((prev) =>
          prev.map((b) =>
            b.id === boardToEdit.id ? { ...b, title: newTitle } : b
          )
        );

        setShowEditDialog(false);
        setBoardToEdit(null);
      } catch (error) {
        console.error("Error renombrando board:", error);
        alert("Error al renombrar el tablero");
      }
    },
    [boardToEdit, user?.id]
  );

  // 🔹 Iniciar eliminación de board
  const handleDeleteClick = useCallback((e, board) => {
    e.stopPropagation();
    setBoardToDelete(board);
    setShowDeleteDialog(true);
  }, []);

  // 🔹 Confirmar eliminación
  const handleConfirmDelete = useCallback(async () => {
    if (!boardToDelete) return;

    try {
      await BoardLogic.deleteBoard(boardToDelete.id, user.id);

      const updatedBoards = boards.filter((b) => b.id !== boardToDelete.id);
      setBoards(updatedBoards);

      // Si se eliminó el board activo, cambiar al primero disponible
      if (currentBoardId === boardToDelete.id && updatedBoards.length > 0) {
        onBoardChange(updatedBoards[0].id);
      } else if (updatedBoards.length === 0) {
        // Si no quedan boards, crear uno nuevo automáticamente
        const newBoard = await BoardLogic.createMainBoard(user.id);
        setBoards([newBoard]);
        onBoardChange(newBoard.id);
      }

      setShowDeleteDialog(false);
      setBoardToDelete(null);
    } catch (error) {
      console.error("Error eliminando board:", error);
      alert("Error al eliminar el tablero");
    }
  }, [boardToDelete, boards, currentBoardId, user?.id, onBoardChange]);

  const canCreateMoreBoards = boards.length < 3;

  if (loadingBoards) {
    return (
      <Sidebar className="fixed top-0 left-0 z-50 h-full w-64 bg-black/40 border-r border-white/10 shadow-2xl text-white">
        <SidebarContent className="bg-[#0f0f0f] py-4 px-3">
          <div className="p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-10 bg-gray-700 rounded"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <>
      <ExportConfirmDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onConfirm={handleExport}
      />

      <CreateBoardDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onConfirm={handleCreateBoard}
      />

      <EditBoardDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onConfirm={handleConfirmEdit}
        currentName={boardToEdit?.title || ""}
      />

      <DeleteBoardDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      <Sidebar className="fixed top-0 left-0 z-50 h-full w-64 bg-black/40 border-r border-white/10 shadow-2xl text-white">
        <SidebarContent className="bg-[#0f0f0f] py-4 px-3">
          <SidebarHeader className="py-0">
            <SidebarGroup>
              <h1 className="text-2xl font-bold leading-none">NIMA</h1>
              <a
                href="https://www.nicolasdev.com/"
                target="_blank"
                className="text-gray-400 text-xs"
              >
                www.nicolasdev.com
              </a>
            </SidebarGroup>
          </SidebarHeader>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70">
              Acciones
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={handleOpenNewTask}
                  >
                    <SquarePen className="w-4 h-4" />
                    Nueva tarea
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={handleAddNewColumn}
                  >
                    <Columns2 className="w-4 h-4" />
                    Nueva columna
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarDays className="w-4 h-4" />
                    Modo calendario
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70">
              Mis Datos
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={() => setShowExportDialog(true)}
                  >
                    <Download className="w-4 h-4" />
                    Exportar tablero
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70">
              Personalizar
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsCustomizeDialogOpen(true)}
                    className="cursor-pointer"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Personalizar NIMA
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={() => setIsInfodialogOpen(true)}
                  >
                    <CircleQuestionMark className="w-4 h-4" />
                    Acerca de NIMA
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70 flex items-center gap-2">
              Mis Tableros ({boards.length} de 3)
            </SidebarGroupLabel>
            <div className="text-sm text-gray-500 ml-2 mb-2"></div>
            <SidebarGroupContent>
              <SidebarMenu>
                {boards.map((board) => (
                  <SidebarMenuItem key={board.id}>
                    <SidebarMenuButton
                      onClick={() => onBoardChange(board.id)}
                      className={`cursor-pointer group flex items-center justify-between transition-all  ${
                        currentBoardId === board.id
                          ? "border-1 border-white/10 hover:bg-transparent hover:text-white text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex gap-2 items-center ">
                        <ClipboardList className="w-4 h-4" />
                        <span>{board.title}</span>
                      </div>

                      <div className="flex gap-2 items-center ">
                        <Edit2
                          onClick={(e) => handleEditClick(e, board)}
                          className="w-3 h-3 text-blue-400 hover:text-blue-300"
                          title="Editar tablero"
                        />

                        <Trash2
                          onClick={(e) => handleDeleteClick(e, board)}
                          className="w-3 h-3 text-red-400 hover:text-red-300"
                          title="Eliminar tablero"
                        />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {boards.length === 0 && (
                  <div className="text-center text-gray-500 py-8 px-2">
                    <p className="text-sm">No tenés tableros todavía</p>
                    <p className="text-xs mt-1 opacity-70">
                      Creá tu primer tablero
                    </p>
                  </div>
                )}

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setShowCreateDialog(true)}
                    disabled={!canCreateMoreBoards || creatingBoard}
                    className={`cursor-pointer mt-2 text-center transition-all ${
                      canCreateMoreBoards && !creatingBoard
                        ? "hover:bg-white/70"
                        : "bg-gray-700 text-white/70 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {creatingBoard
                      ? "Creando..."
                      : canCreateMoreBoards
                      ? "Crear tablero"
                      : "Límite alcanzado"}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70">
              Cuenta
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <p className="text-white/50 ml-2 text-sm">
                    Sesión de {userName}
                  </p>
                  <SidebarMenuButton
                    onClick={() => supabase.auth.signOut()}
                    className="cursor-pointer mt-2"
                    id="button-logout"
                  >
                    <LogOut className="w-5 h-5" title="Logout" alt="Logout" />
                    Cerrar sesión
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
});

export default SidebarNima;
