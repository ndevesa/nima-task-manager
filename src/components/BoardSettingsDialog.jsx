import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Share2, Copy, Check, CircleAlert } from "lucide-react";

export function BoardSettingsDialog({
  open,
  onOpenChange,
  board,
  onRename,
  onDelete,
  onShare, // Para futuro
}) {
  const [activeTab, setActiveTab] = useState("edit");
  const [boardTitle, setBoardTitle] = useState("");
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Actualizar título cuando se abre el dialog
  useEffect(() => {
    if (open && board) {
      setBoardTitle(board.title);
      setError("");
      setActiveTab("edit");
      // Simular link de compartir (implementar después)
      setShareLink(`${window.location.origin}/board/${board.id}`);
    }
  }, [open, board]);

  const handleRename = () => {
    if (!boardTitle.trim()) {
      setError("El nombre del tablero no puede estar vacío");
      return;
    }

    if (boardTitle.trim() === board.title) {
      setError("Ingresá un nombre diferente");
      return;
    }

    onRename(boardTitle.trim());
    setError("");
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(`¿Estás 100% seguro? Esta acción no se puede deshacer.`)
    ) {
      onDelete();
      onOpenChange(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error copiando link:", err);
    }
  };

  const tabs = [
    { id: "edit", label: "Editar", icon: Pencil },
    { id: "share", label: "Compartir", icon: Share2 },
    { id: "delete", label: "Eliminar", icon: Trash2 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#0f0f0f] border-white/20 text-white max-w-2xl"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle>Configuración del tablero {board?.title}</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-2 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <div className="py-4 min-h-[200px]">
          {/* EDITAR */}
          {activeTab === "edit" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="board-title" className="text-white/70 mb-2">
                  Nombre del tablero
                </Label>
                <Input
                  id="board-title"
                  value={boardTitle}
                  onChange={(e) => {
                    setBoardTitle(e.target.value);
                    setError("");
                  }}
                  placeholder="Nombre del tablero"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  maxLength={50}
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <p className="text-sm text-white/50 mt-2">
                  Podes cambiar el nombre de tu tablero para organizarlo mejor.
                </p>
              </div>
            </div>
          )}

          {/* COMPARTIR (Próximamente) */}
          {activeTab === "share" && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Compartir tablero
                </h4>
                <p className="text-white/70 text-sm mb-4">
                  Próximamente podrás compartir tu tablero con otros usuarios.
                  El link será semi-público y requerirá que la otra persona esté
                  logueada para acceder.
                </p>

                <div className="space-y-3 opacity-50 pointer-events-none">
                  <Label className="text-white/50">Link de compartir</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="bg-white/5 border-white/10 text-white/50"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopyLink}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ELIMINAR */}
          {activeTab === "delete" && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                  <CircleAlert className="w-4 h-4" />
                  ¡Cuidado!
                </h4>
                <p className="text-white/70 text-sm mb-4">
                  Recuerda que puedes exportar este tablero como PDF antes de
                  eliminarlo. Se eliminarán permanentemente todas las columnas y
                  tareas de este tablero. Ésta acción no se puede deshacer.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar tablero permanentemente
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setError("");
              onOpenChange(false);
            }}
            className="text-black"
          >
            Cancelar
          </Button>

          {activeTab === "edit" && (
            <Button
              onClick={handleRename}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Guardar cambios
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default BoardSettingsDialog;
