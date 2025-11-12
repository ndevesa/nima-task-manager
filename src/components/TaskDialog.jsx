import { React, useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Trash2,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TaskDialog({
  isOpen,
  setIsOpen,
  editingTaskId,
  formData,
  setFormData,
  onSaveTask,
  handleDeleteTask,
  data,
  priorities,
}) {
  /* UPLOAD FILE HANDLERS */
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAttachmentFile(null);
    }
  }, [isOpen, editingTaskId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no puede superar 5MB");
        return;
      }
      setAttachmentFile(file);
    }
  };

  const removeAttachment = () => {
    setAttachmentFile(null);
    setFormData((prev) => ({
      ...prev,
      attachment_url: null,
      attachment_name: null,
      attachment_type: null,
    }));
  };

  const handleSave = async () => {
    if (!formData.category || !formData.taskPriority) {
      alert("Por favor seleccioná una columna y una prioridad para la tarea.");
      return;
    }

    if (attachmentFile) {
      setUploadingFile(true);
    }

    try {
      await onSaveTask(attachmentFile);
      /* console.log("✅ Guardado exitoso"); */
      setAttachmentFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error("❌ Error guardando:", error);
      alert(`Error al guardar la tarea: ${error.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  // ---- Subtasks handlers ----
  const addSubtask = () => {
    setFormData((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), { title: "", completed: false }],
    }));
  };

  const removeSubtask = (index) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const handleSubtaskChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s, i) =>
        i === index ? { ...s, title: value } : s
      ),
    }));
  };

  const handleSubtaskToggle = (index, checked) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((s, i) =>
        i === index ? { ...s, completed: checked } : s
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#0f0f0f] border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingTaskId ? "Editar tarea" : "Nueva tarea"}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {editingTaskId
              ? "Modificá los campos de tu tarea."
              : "Completá los datos para crear una nueva tarea."}
          </DialogDescription>
        </DialogHeader>

        {/* --- FORM --- */}
        <div className="space-y-4 max-w-2xl">
          {/* Título */}
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Ej: Diseñar landing page (*)"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />

          {/* Descripción */}
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe los detalles de la tarea..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px] max-h-[200px] max-w-[480px]"
          />

          {/* Subtareas */}
          <div className="space-y-3">
            <Label>Subtareas</Label>
            {(formData.subtasks || []).map((subtask, index) => (
              <div key={index} className="flex items-center gap-2">
                <Checkbox
                  checked={!!subtask.completed}
                  onCheckedChange={(checked) =>
                    handleSubtaskToggle(index, checked)
                  }
                />
                <Input
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  placeholder={`Subtarea ${index + 1}`}
                  className="flex-1 bg-white/5 border-white/10 text-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubtask(index)}
                  className="text-white/50 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="default"
              size="sm"
              onClick={addSubtask}
              className="w-full border-white/20 text-dark hover:bg-white/10"
            >
              + Añadir subtarea
            </Button>
          </div>

          {/* Tag (badge) */}
          <div>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="tag"
                value={formData.tag || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tag: e.target.value }))
                }
                placeholder="Etiqueta"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Categoría + Prioridad */}
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="flex-1">
              <Select
                value={formData.category || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white w-full">
                  <SelectValue placeholder="Categoría (*)" />
                </SelectTrigger>
                <SelectContent className="bg-transparent backdrop-blur-2xl border-white/20 text-white">
                  {data.columnOrder.map((colId) => (
                    <SelectItem key={colId} value={colId}>
                      {data.columns[colId].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Select
                value={formData.taskPriority || undefined}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, taskPriority: value }))
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 w-full">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent className="bg-transparent backdrop-blur-2xl border-white/20 text-white">
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fecha */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <CalendarIcon className="h-4 w-4 opacity-70" />
                {formData.dueDate ? (
                  format(formData.dueDate, "dd/MM/yyyy", { locale: es })
                ) : (
                  <span>Vencimiento</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-white/20">
              <Calendar
                mode="single"
                selected={formData.dueDate}
                onSelect={(date) =>
                  setFormData((prev) => ({ ...prev, dueDate: date }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* NUEVO: Input de archivo */}
          <div className="space-y-3">
            <Label>Adjuntar archivo</Label>

            {!attachmentFile && !formData.attachment_url ? (
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 cursor-pointer transition bg-white/5">
                <Paperclip className="w-4 h-4 text-white/50" />
                <span className="text-sm text-white/50">
                  Imagen/PDF (5MB max)
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg border border-white/20">
                {attachmentFile ? (
                  <>
                    {attachmentFile.type.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5 text-blue-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-red-400" />
                    )}
                    <span className="flex-1 text-sm truncate">
                      {attachmentFile.name}
                    </span>
                  </>
                ) : (
                  <>
                    {formData.attachment_type?.startsWith("image/") ? (
                      <ImageIcon className="w-5 h-5 text-blue-400" />
                    ) : (
                      <FileText className="w-5 h-5 text-red-400" />
                    )}
                    <span className="flex-1 text-sm truncate">
                      {formData.attachment_name}
                    </span>
                  </>
                )}
                <button
                  onClick={removeAttachment}
                  disabled={uploadingFile}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <DialogFooter className="mt-4">
          {editingTaskId && (
            <Button
              variant="destructive"
              onClick={() => {
                if (window.confirm(`¿Eliminar "${formData.title}"?`)) {
                  handleDeleteTask(editingTaskId);
                  setIsOpen(false);
                }
              }}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => {
              setAttachmentFile(null);
              setIsOpen(false); // ← Simple
            }}
            disabled={uploadingFile}
            className="text-black cursor-pointer"
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSave}
            disabled={!formData.title || uploadingFile}
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px] cursor-pointer"
          >
            {uploadingFile ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Subiendo...</span>
              </div>
            ) : editingTaskId ? (
              "Actualizar"
            ) : (
              "Guardar tarea"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
