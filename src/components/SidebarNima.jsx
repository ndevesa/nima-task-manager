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
} from "@/components/ui/sidebar";
import {
  SquarePen,
  Columns2,
  CalendarDays,
  PencilIcon,
  LogOut,
  Download,
  Plus,
  ClipboardList,
  Settings,
  User,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";
import { ExportConfirmDialog } from "./ExportConfirmDialog";
import { CreateBoardDialog } from "./CreateBoardDialog";
import BoardSettingsDialog from "./BoardSettingsDialog";
import * as BoardLogic from "@/lib/BoardLogic";
import { exportData } from "@/lib/exportData";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  const [creatingBoard, setCreatingBoard] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Estados para el nuevo BoardSettingsDialog
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showBoardSettings, setShowBoardSettings] = useState(false);

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

      const formattedData = {
        columns: {},
        tasks: {},
      };

      tasks.forEach((task) => {
        formattedData.tasks[task.id] = {
          content: task.title,
          description: task.description,
          taskPriority: task.priority,
          dueDate: task.dueDate,
        };
      });

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

  // Cargar boards del usuario
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    async function loadBoards() {
      setLoadingBoards(true);
      try {
        const userBoards = await BoardLogic.loadUserBoards(user.id);

        if (!isMounted) return;

        setBoards(userBoards);

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

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Crear nuevo board
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

  // Abrir configuración del board
  const handleOpenBoardSettings = useCallback((e, board) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setShowBoardSettings(true);
  }, []);

  // Renombrar board
  const handleRenameBoard = useCallback(
    async (newTitle) => {
      if (!selectedBoard) return;

      try {
        await BoardLogic.renameBoard(selectedBoard.id, user.id, newTitle);

        setBoards((prev) =>
          prev.map((b) =>
            b.id === selectedBoard.id ? { ...b, title: newTitle } : b
          )
        );

        setShowBoardSettings(false);
        setSelectedBoard(null);
      } catch (error) {
        console.error("Error renombrando board:", error);
        alert("Error al renombrar el tablero");
      }
    },
    [selectedBoard, user?.id]
  );

  // Eliminar board
  const handleDeleteBoard = useCallback(async () => {
    if (!selectedBoard) return;

    try {
      await BoardLogic.deleteBoard(selectedBoard.id, user.id);

      const updatedBoards = boards.filter((b) => b.id !== selectedBoard.id);
      setBoards(updatedBoards);

      if (currentBoardId === selectedBoard.id && updatedBoards.length > 0) {
        onBoardChange(updatedBoards[0].id);
      } else if (updatedBoards.length === 0) {
        const newBoard = await BoardLogic.createMainBoard(user.id);
        setBoards([newBoard]);
        onBoardChange(newBoard.id);
      }

      setShowBoardSettings(false);
      setSelectedBoard(null);
    } catch (error) {
      console.error("Error eliminando board:", error);
      alert("Error al eliminar el tablero");
    }
  }, [selectedBoard, boards, currentBoardId, user?.id, onBoardChange]);

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

      <BoardSettingsDialog
        open={showBoardSettings}
        onOpenChange={setShowBoardSettings}
        board={selectedBoard}
        onRename={handleRenameBoard}
        onDelete={handleDeleteBoard}
        onExport={handleExport}
        onShare={() => {
          alert("Funcionalidad próximamente");
        }}
      />

      <Sidebar className="fixed top-0 left-0 z-50 h-full w-64 bg-black/40 border-r border-white/10 shadow-2xl text-white">
        <SidebarContent className="bg-[#0f0f0f] py-4 px-3">
          <SidebarHeader className="py-0">
            <SidebarGroup>
              <img
                src="/nima-white.svg"
                className="mb-1"
                alt="NIMA logo"
                title="NIMA logo"
                width="100"
              />
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
                      className={`cursor-pointer group flex items-center justify-between transition-all ${
                        currentBoardId === board.id
                          ? "border-1 border-white/10 hover:bg-white/40 hover:text-white bg-white/40 text-white"
                          : "hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex gap-2 items-center">
                        <ClipboardList className="w-4 h-4" />
                        <span>{board.title}</span>
                      </div>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Settings
                            onClick={(e) => handleOpenBoardSettings(e, board)}
                            className="w-4 h-4 text-gray-400 hover:text-white transition-colors"
                            title="Configuración del tablero"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Configurar tablero</p>
                        </TooltipContent>
                      </Tooltip>
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
                    className={`cursor-pointer mt-2 text-center text-[11px] transition-all ${
                      canCreateMoreBoards && !creatingBoard
                        ? "hover:bg-white"
                        : "bg-gray-700 text-white/70 cursor-not-allowed"
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

          <Separator className="border border-white/10" />

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
                    Calendario
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="border border-white/10" />

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

          <Separator className="border border-white/10" />

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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#464646]/20">
                    <div className="flex items-center justify-between">
                      <Avatar>
                        <AvatarImage />
                        <AvatarFallback>
                          <User className="w-5 h-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-white/50 ml-2 text-sm">{userName}</p>
                    </div>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => supabase.auth.signOut()}
                          className="cursor-pointer"
                          id="button-logout"
                        >
                          <LogOut
                            className="w-5 h-5"
                            title="Logout"
                            alt="Logout"
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Cerrar sesión</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
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
