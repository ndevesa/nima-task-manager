import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Database,
  Eye,
  LayoutList,
  LayoutDashboard,
  CircleQuestionMark,
  Heart,
  Handshake,
} from "lucide-react";
import TaskSearch from "./TaskSearch";
import FeedBackDialog from "./FeedBackDialog";

export default function Header({
  data,
  isDemoMode,
  viewMode,
  setViewMode,
  handleLoadRealData,
  handleLoadDemo,
  setFilters,
  setIsInfodialogOpen,
}) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  return (
    <>
      <FeedBackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
      />

      <header className="flex flex-col md:flex-row flex-wrap max-w-full gap-4 justify-center items-center p-4">
        <div className="flex justify-center items-center gap-4 ml-auto">
          {isDemoMode && (
            <Alert className="flex flex-col items-center w-fit md:flex-row my-3 border-orange-500/20 relative bg-orange-500/10 m-0">
              <Eye className="w-[20px] h-[20px] text-white" color="#fff" />
              <AlertDescription className="pr-6 text-white">
                Modo Demo Activado - Los cambios no se guardarán
              </AlertDescription>
            </Alert>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={isDemoMode ? handleLoadRealData : handleLoadDemo}
                className="bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/20 border cursor-pointer"
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

          {data?.columns && (
            <TaskSearch columns={data.columns} onSearchChange={setFilters} />
          )}
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="cursor-pointer ml-auto hover:bg-white hover:text-[#0f0f0f] transition-colors"
              onClick={() =>
                setViewMode(viewMode === "boardview" ? "listview" : "boardview")
              }
            >
              {viewMode === "boardview" ? <LayoutList /> : <LayoutDashboard />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cambiar Vista</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex gap-2 ml-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer ml-auto hover:bg-white hover:text-[#0f0f0f] transition-colors"
                onClick={() => setShowFeedbackDialog(true)}
              >
                <Handshake className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dejar comentarios</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                className="cursor-pointer ml-auto hover:bg-white hover:text-[#0f0f0f] transition-colors"
              >
                <a
                  href="https://cafecito.app/nima-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="w-4 h-4" />
                </a>
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Colaborar</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="cursor-pointer ml-auto hover:bg-white hover:text-[#0f0f0f] transition-colors"
                onClick={() => setIsInfodialogOpen(true)}
              >
                <CircleQuestionMark className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>¿Qué es NIMA?</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* <div
            id="Menu"
            className="bg-white/10 border border-white/20 p-2 rounded-lg items-center gap-2 w-fit xs:w-full flex justify-between flex-wrap"
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
                className="bg-gray backdrop-blur-lg border-white/20 text-white"
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
          </div> */}

        {/* <div className="bg-white/10 border border-white/20 p-2 rounded-lg flex flex-wrap w-fit items-center gap-2">
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
          </div> */}
      </header>
    </>
  );
}
