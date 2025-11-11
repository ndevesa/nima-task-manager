import { useState } from "react";
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

export function CreateBoardDialog({ open, onOpenChange, onConfirm }) {
  const [boardTitle, setBoardTitle] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!boardTitle.trim()) {
      setError("El nombre del tablero no puede estar vacío");
      return;
    }

    onConfirm(boardTitle.trim());
    setBoardTitle("");
    setError("");
  };

  const handleCancel = () => {
    setBoardTitle("");
    setError("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Crear nuevo tablero</AlertDialogTitle>
          <AlertDialogDescription>
            Dale un nombre a tu nuevo tablero. Se crearán automáticamente 3
            columnas: Por hacer, Revisión y Completado.
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
            placeholder="Nombre del tablero"
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
            Crear tablero
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CreateBoardDialog;
