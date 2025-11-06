import { useState } from "react";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  SquarePen,
  Columns2,
  CalendarDays,
  Settings,
  PencilIcon,
  CircleQuestionMark,
  LogOut,
  Download,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { ExportConfirmDialog } from "./ExportConfirmDialog";

export default function SidebarNima({
  userName,
  handleOpenNewTask,
  handleAddNewColumn,
  setIsCalendarOpen,
  handleExport,
  handleImport,
  setIsCustomizeDialogOpen,
  setIsInfodialogOpen,
}) {
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleConfirmExport = () => {
    handleExport(); // Llama a tu función de exportación
    setShowExportDialog(false); // Cierra el diálogo
  };

  return (
    <>
      <ExportConfirmDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onConfirm={handleConfirmExport}
      />
      <Sidebar className="fixed top-0 left-0 z-50 h-full w-64 bg-black/40  border-r border-white/10 shadow-2xl text-white">
        <SidebarContent className="bg-[#0f0f0f] py-4 px-3">
          <SidebarHeader className="py-0">
            <SidebarMenu>
              <div>
                <h1 className="text-2xl font-bold">NIMA</h1>
                <small>[{userName}] </small>
              </div>
            </SidebarMenu>
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
              Tus Datos
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
                {/* <SidebarMenuItem>
                  <SidebarMenuButton
                    className="cursor-pointer"
                    onClick={handleImport}
                  >
                    <Upload className="w-4 h-4" />
                    Importar tablero
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
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
            <SidebarGroupLabel className="text-white/70">
              Cuenta
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => supabase.auth.signOut()}
                    className="cursor-pointer"
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
}
