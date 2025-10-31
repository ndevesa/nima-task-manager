import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { bgImages, bgColors } from "../constants/backgrounds";

export default function CustomizeDialog({ open, setOpen }) {
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const handleSave = async () => {
    const bgValue = selectedImage ? selectedImage.src : selectedColor;

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ background: bgValue, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) console.error("Error guardando background:", error);
    }

    // Aplicar visualmente
    if (selectedImage) {
      document.body.style.backgroundImage = `url(${selectedImage.src})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundColor = "";
    } else if (selectedColor) {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = selectedColor;
    }

    setOpen(false);
  };

  // Live preview directo dentro del dialog
  const previewStyle = useMemo(
    () => ({
      backgroundImage: selectedImage ? `url(${selectedImage.src})` : "none",
      backgroundColor:
        selectedColor || (selectedImage ? "transparent" : "#0f172a"),
      backgroundSize: "cover",
      backgroundPosition: "center",
    }),
    [selectedImage, selectedColor]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black border-white/20 text-white/70 max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">
            Personalizar NIMA
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Elegí un fondo o color para personalizar tu tablero.
          </DialogDescription>
        </DialogHeader>

        {/* Preview */}
        <div
          className="rounded-xl border border-white/10 mt-3 h-32 flex items-center justify-center text-white text-sm"
          style={previewStyle}
        >
          Vista previa
        </div>

        <div className="mt-6 space-y-6">
          {/* Fondos */}
          <div>
            <h3 className="text-white font-semibold mb-2">Fondos</h3>
            <div className="grid grid-cols-4 gap-3">
              {bgImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => {
                    setSelectedImage(img);
                    setSelectedColor(null);
                  }}
                  className={`relative rounded-xl overflow-hidden border-2 transition ${
                    selectedImage?.id === img.id
                      ? "border-blue-400"
                      : "border-transparent hover:border-white/30"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="object-cover w-full h-20 opacity-90 hover:opacity-100"
                  />
                  {selectedImage?.id === img.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Check className="text-white w-6 h-6" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Colores */}
          <div>
            <h3 className="text-white font-semibold mb-2">Colores</h3>
            <div className="flex flex-wrap gap-3">
              {bgColors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedImage(null);
                  }}
                  style={{ backgroundColor: color }}
                  className={`w-10 h-10 rounded-full border-2 transition ${
                    selectedColor === color
                      ? "border-white scale-110"
                      : "border-transparent hover:border-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
