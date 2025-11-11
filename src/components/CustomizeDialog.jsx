import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { bgImages, bgColors } from "../constants/backgrounds";

export default function CustomizeDialog({
  open,
  setOpen,
  setIsCustomizeDialogOpen,
}) {
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [uploadedBackground, setUploadedBackground] = useState(null);

  const uploadUserBackground = async (file, userId) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `background-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("user-backgrounds")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    return filePath;
  };

  const handleSave = async () => {
    let bgValue = selectedColor || null;

    try {
      if (uploadedBackground) {
        const uploadedPath = await uploadUserBackground(
          uploadedBackground,
          user.id
        );
        bgValue = uploadedPath;
      } else if (selectedImage) {
        bgValue = selectedImage.src;
      }

      await supabase
        .from("profiles")
        .update({ background: bgValue, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (bgValue?.startsWith("http")) {
        document.body.style.backgroundImage = `url(${bgValue})`;
      } else if (bgValue?.includes("/")) {
        // Recuperar URL firmada temporalmente (válida por ej. 1 hora)
        const { data, error } = await supabase.storage
          .from("user-backgrounds")
          .createSignedUrl(bgValue, 3600); // 1 hora

        if (!error && data?.signedUrl) {
          document.body.style.backgroundImage = `url(${data.signedUrl})`;
        }
      } else {
        document.body.style.backgroundColor = bgValue;
        document.body.style.backgroundImage = "none";
      }

      setOpen(false);
    } catch (err) {
      console.error("Error subiendo fondo:", err);
    }
  };

  // Live preview directo dentro del dialog
  const previewStyle = useMemo(() => {
    let backgroundImage = "none";
    if (selectedImage) backgroundImage = `url(${selectedImage.src})`;
    else if (uploadedBackground)
      backgroundImage = `url(${URL.createObjectURL(uploadedBackground)})`;

    return {
      backgroundImage,
      backgroundColor:
        selectedColor ||
        (selectedImage || uploadedBackground ? "transparent" : "#0f172a"),
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }, [selectedImage, selectedColor, uploadedBackground]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-[#0f0f0f] backdrop-blur-2xl border-white/20 text-white/70 max-w-xl">
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

            <Carousel className="w-full cursor-grabbing">
              <CarouselContent className="-ml-1 ">
                {bgImages.map((img) => (
                  <CarouselItem key={img.id} className="basis-1/3 pl-1">
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
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 cursor-pointer transition bg-white/5 mt-4 mx-1">
              <Paperclip className="w-4 h-4 text-white/50" />
              <span className="text-sm text-white/50">Imagen (3MB max)</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setUploadedBackground(e.target.files[0])}
              />
            </label>
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
