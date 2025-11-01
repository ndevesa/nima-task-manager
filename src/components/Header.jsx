import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  CalendarDays,
  CircleQuestionMark,
  Columns2,
  Database,
  Download,
  Eye,
  LogOut,
  PencilIcon,
  Settings,
  SquarePen,
  Trash2,
  Upload,
  User,
  Info,
  X,
} from "lucide-react";

import TaskSearch from "./TaskSearch";
import * as BoardLogic from "@/lib/BoardLogic";
import { supabase } from "@/lib/supabaseClient";

export default function Header({
  userName,
  data,
  setData,
  initialData,
  isDemoMode,
  setIsDemoMode,
  handleLoadRealData,
  handleLoadDemo,
  handleOpenNewTask,
  handleAddNewColumn,
  handleExport,
  handleImport,
  setIsCalendarOpen,
  setIsCustomizeDialogOpen,
  setIsInfodialogOpen,
  setFilters,
}) {
  const [showBanner, setShowBanner] = useState(
    () => !localStorage.getItem("tgc-banner-dismissed")
  );

  useEffect(() => {
    if (!showBanner) {
      localStorage.setItem("tgc-banner-dismissed", "true");
    }
  }, [showBanner]);

  return (
    <>
      {isDemoMode && (
        <Alert className="my-3 border-orange-500/20 relative bg-orange-500/10">
          <Eye className="w-[20px] h-[20px] text-white" color="#fff" />
          <AlertDescription className="pr-6 text-white">
            Modo Demo Activado - Los cambios no se guardarán
          </AlertDescription>
          <button
            onClick={handleLoadRealData}
            className="absolute top-2 right-2 p-1 px-2 hover:bg-white/10 rounded text-orange-400 hover:text-white"
          >
            Volver a mis datos →
          </button>
        </Alert>
      )}

      {showBanner && (
        <Alert className="my-3 border-blue-500/20 relative bg-white/90 text-black">
          <Info className="h-4 w-4" />
          <AlertDescription className="pr-6">
            Tus datos se guardan automáticamente en tu navegador. Usa “Exportar
            datos” regularmente para hacer backup.
          </AlertDescription>
          <AlertDescription className="pr-6">
            Elimina las columnas demo para comenzar a usar NIMA.
          </AlertDescription>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </Alert>
      )}

      <header className="p-4 md:py-4 md:px-0 flex md:flex-row gap-4 justify-between items-center">
        <div className="block">
          <div className="flex items-end gap-2 mb-2">
            <h1 className="text-2xl font-bold leading-none">NIMA</h1>
            <small>
              <i>Task Manager</i>
            </small>
          </div>
          <h6 className="font-bold leading-none">[{userName}] </h6>
        </div>

        <div className="flex gap-4 items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={isDemoMode ? handleLoadRealData : handleLoadDemo}
                className={`${
                  isDemoMode
                    ? "hidden"
                    : "bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/20 border rounded-full"
                }`}
              >
                {isDemoMode ? (
                  <Database className="w-[20px] h-[20px]" />
                ) : (
                  <Eye className="w-[20px] h-[20px]" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDemoMode ? "Desactivar Demo" : "Activar Demo"}</p>
            </TooltipContent>
          </Tooltip>

          <TaskSearch columns={data.columns} onSearchChange={setFilters} />

          <div
            id="Menu"
            className="bg-white/10 border border-white/20 p-2 rounded-lg flex items-center gap-2"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleOpenNewTask}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <SquarePen className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nueva tarea</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddNewColumn}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <Columns2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nueva columna</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsCalendarOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <CalendarDays className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modo Calendario</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white/10 hover:bg-white/20 border border-white/20">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-gray-900 border-white/20 text-white"
              >
                <DropdownMenuItem
                  onClick={handleExport}
                  className="cursor-pointer hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar datos
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleImport}
                  className="cursor-pointer hover:bg-white/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar datos
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    if (
                      window.confirm(
                        "⚠️ ¿Eliminar TODOS los datos? Esta acción no se puede deshacer."
                      )
                    ) {
                      BoardLogic.clearLocalStorage();
                      setData(initialData);
                      alert(
                        "✅ Datos eliminados. Se restauraron los datos por defecto."
                      );
                    }
                  }}
                  className="cursor-pointer hover:bg-red-500/10 text-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar todos los datos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="bg-white/10 border border-white/20 p-2 rounded-lg flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCustomizeDialogOpen(true);
                  }}
                  className="text-sm text-dark bg-white/10 hover:text-white cursor-pointer hover:bg-white/20 border border-white/20"
                >
                  <PencilIcon
                    size={25}
                    title="Personalizar NIMA"
                    alt="Personalizar NIMA"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Personalizar NIMA</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsInfodialogOpen(true);
                  }}
                  className="text-sm text-dark bg-white/10 hover:text-white cursor-pointer hover:bg-white/20 border border-white/20"
                >
                  <CircleQuestionMark
                    size={25}
                    title="Información sobre la aplicación"
                    alt="Información sobre la aplicación"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Acerca de NIMA</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => supabase.auth.signOut()}
                  id="button-logout"
                  className="text-sm text-dark bg-white/10 hover:text-white cursor-pointer hover:bg-white/20 border border-white/20"
                >
                  <LogOut className="w-5 h-5" title="Logout" alt="Logout" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cerrar sesión</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>
    </>
  );
}
