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

      <header className="flex flex-col md:flex-row flex-wrap max-w-full gap-4 justify-center items-center  m-4 py-2 px-3 backdrop-blur-xs rounded-2xl border border-white/10 shadow-xl">
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
      </header>
    </>
  );
}
