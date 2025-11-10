import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EditBoardDialog({
  open,
  onOpenChange,
  onConfirm,
  currentName,
}) {
  const [boardTitle, setBoardTitle] = useState("");
  const [error, setError] = useState("");

  // Actualizar el título cuando se abre el dialog
  useEffect(() => {
    if (open && currentName) {
      setBoardTitle(currentName);
    }
  }, [open, currentName]);

  const handleConfirm = () => {
    if (!boardTitle.trim()) {
      setError("El nombre del tablero no puede estar vacío");
      return;
    }

    if (boardTitle.trim() === currentName) {
      setError("Ingresá un nombre diferente");
      return;
    }

    onConfirm(boardTitle.trim());
    setBoardTitle("");
    setError("");
  };

  const handleCancel = () => {
    setBoardTitle(currentName);
    setError("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Editar nombre del tablero</AlertDialogTitle>
          <AlertDialogDescription>
            Cambiá el nombre de tu tablero para organizarlo mejor.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => {
              setBoardTitle(e.target.value);
              setError("");
            }}
            placeholder="Nombre del tablero..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={50}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="cursor-pointer">
            Guardar cambios
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditBoardDialog;
