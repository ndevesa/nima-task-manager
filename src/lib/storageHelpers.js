import { supabase } from "./supabaseClient";

// Subir archivo
export const uploadTaskAttachment = async (file, userId, taskId) => {
  try {
    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("El archivo no puede superar 5MB");
    }

    // Validar tipo
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Solo se permiten imágenes (JPG, PNG, WebP) y PDFs");
    }

    // Generar nombre único
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${taskId}-${Date.now()}.${fileExt}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from("task-attachments")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("task-attachments")
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      name: file.name,
      type: file.type,
    };
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    throw error;
  }
};

// Eliminar archivo
export const deleteTaskAttachment = async (attachmentUrl) => {
  try {
    // Extraer path del archivo de la URL
    const urlParts = attachmentUrl.split("/task-attachments/");
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from("task-attachments")
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error("Error eliminando archivo:", error);
    throw error;
  }
};
